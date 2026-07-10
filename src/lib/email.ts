/**
 * Transactional email via Resend.
 *  - sendInstantAlert: fired the moment a quote comes in (so nothing waits a week)
 *  - sendWeeklyDigest: the Monday-morning summary of the week's leads
 *
 * Env:
 *  RESEND_API_KEY   — from resend.com (required to actually send)
 *  LEAD_EMAIL_TO    — recipient(s), comma-separated (default: SWPlumbing73@gmail.com)
 *  LEAD_EMAIL_FROM  — verified sender (default: Resend's shared onboarding sender,
 *                     which can deliver to your own Resend-account email without a
 *                     custom domain). Swap to a real domain sender once one exists.
 */
import { Resend } from 'resend';
import type { Lead } from './leads';

const TO = (process.env.LEAD_EMAIL_TO || 'SWPlumbing73@gmail.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const FROM = process.env.LEAD_EMAIL_FROM || 'S&W Plumbing <onboarding@resend.dev>';

function client(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

const GREEN = '#00A651';
const INK = '#101412';
const esc = (s: string | null | undefined) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fmtDate(iso: string): string {
  // Brisbane time (UTC+10, no DST)
  return new Date(iso).toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function shell(title: string, inner: string): string {
  return `<div style="background:#f4f6f4;padding:24px 0;font-family:Arial,Helvetica,sans-serif;color:${INK}">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e2e8e2;border-radius:14px;overflow:hidden">
    <div style="background:${INK};padding:18px 24px">
      <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.01em">S&amp;W Plumbing</span>
      <span style="color:${GREEN};font-size:18px;font-weight:700"> · leads</span>
    </div>
    <div style="padding:24px">
      <h1 style="margin:0 0 16px;font-size:20px;color:${INK}">${title}</h1>
      ${inner}
    </div>
    <div style="padding:14px 24px;background:#f4f6f4;border-top:1px solid #e2e8e2;font-size:12px;color:#6b756e">
      Sent automatically by the S&amp;W Plumbing website.
    </div>
  </div>
</div>`;
}

function leadBlock(l: Pick<Lead, 'name' | 'phone' | 'suburb' | 'service' | 'message'> & { created_at?: string }): string {
  const row = (label: string, val: string) =>
    `<tr>
      <td style="padding:6px 12px 6px 0;color:#6b756e;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td>
      <td style="padding:6px 0;font-size:14px;color:${INK}">${val}</td>
    </tr>`;
  const phone = esc(l.phone);
  return `<table style="width:100%;border-collapse:collapse">
    ${row('Name', `<strong>${esc(l.name)}</strong>`)}
    ${row('Phone', `<a href="tel:${phone.replace(/\s/g, '')}" style="color:${GREEN};font-weight:700;text-decoration:none">${phone}</a>`)}
    ${l.suburb ? row('Suburb', esc(l.suburb)) : ''}
    ${l.service ? row('Service', esc(l.service)) : ''}
    ${l.message ? row('Message', esc(l.message).replace(/\n/g, '<br>')) : ''}
    ${l.created_at ? row('Received', fmtDate(l.created_at)) : ''}
  </table>`;
}

export interface Attachment {
  filename: string;
  content: string; // base64
}

export async function sendInstantAlert(l: {
  name: string;
  phone: string;
  suburb?: string;
  service?: string;
  message?: string;
  id: number;
  attachment?: Attachment;
}): Promise<void> {
  const resend = client();
  const title = '🔧 New quote request';
  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:#46504a">A customer just requested a quote on your website. Give them a call while it's hot.</p>
    <div style="border:1px solid #e2e8e2;border-radius:10px;padding:16px;background:#fbfdfb">${leadBlock(l)}</div>
    ${l.attachment ? `<p style="margin:16px 0 0;font-size:13px;color:#46504a">📎 The customer attached a photo of the issue (see attachment).</p>` : ''}
    <p style="margin:20px 0 0"><a href="tel:${l.phone.replace(/\s/g, '')}" style="display:inline-block;background:${GREEN};color:#fff;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:10px">Call ${esc(l.phone)}</a></p>`;
  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New quote request — ${l.name}${l.suburb ? ` (${l.suburb})` : ''}`,
    html: shell(title, inner),
    attachments: l.attachment ? [l.attachment] : undefined,
  });
}

export async function sendWeeklyDigest(leads: Lead[]): Promise<void> {
  const resend = client();
  const count = leads.length;
  const title = count
    ? `${count} new quote ${count === 1 ? 'request' : 'requests'} this week`
    : 'No new quote requests this week';

  const inner = count
    ? `<p style="margin:0 0 20px;font-size:14px;color:#46504a">Here's everyone who requested a quote in the last 7 days, newest first.</p>` +
      leads
        .map(
          (l) =>
            `<div style="border:1px solid #e2e8e2;border-radius:10px;padding:16px;background:#fbfdfb;margin-bottom:12px">${leadBlock(l)}</div>`
        )
        .join('')
    : `<p style="margin:0;font-size:14px;color:#46504a">Nothing came through the website this week. Have a good one.</p>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `S&W weekly leads — ${count} new ${count === 1 ? 'request' : 'requests'}`,
    html: shell(title, inner),
  });
}
