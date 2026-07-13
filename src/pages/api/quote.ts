/**
 * POST /api/quote — receives a quote-form submission, stores it in Postgres,
 * and fires an instant email alert. Returns JSON { ok: true } on success.
 *
 * Runs as a Vercel serverless function (prerender = false).
 */
import type { APIRoute } from 'astro';
import { ensureSchema, insertLead } from '../../lib/leads';
import { sendInstantAlert, type Attachment } from '../../lib/email';
import { sendToAirtable } from '../../lib/airtable';

export const prerender = false;

const str = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form data.' }, 400);
  }

  // Honeypot — bots fill the hidden `_gotcha` field. Pretend success, store nothing.
  if (str(form.get('_gotcha'))) return json({ ok: true });

  const name = str(form.get('name'));
  const phone = str(form.get('phone'));
  const suburb = str(form.get('suburb'));
  const service = str(form.get('service'));
  const message = str(form.get('message'));

  if (!name || !phone) {
    return json({ ok: false, error: 'Name and phone are required.' }, 400);
  }

  // Store the lead. If the DB write fails, surface an error so the form shows the
  // "please call us" fallback instead of silently losing the enquiry.
  let saved: { id: number; created_at: string };
  try {
    await ensureSchema();
    saved = await insertLead({
      name,
      phone,
      suburb,
      service,
      message,
      ip: clientAddress,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
  } catch (err) {
    console.error('[quote] DB write failed:', err);
    return json({ ok: false, error: 'server' }, 500);
  }

  // Mirror the lead into Airtable so the client can view/manage it in a grid + phone
  // app. Best effort — never fail the request if it hiccups; the lead is safe in the
  // DB. No-ops entirely until AIRTABLE_TOKEN is set.
  try {
    await sendToAirtable({ name, phone, suburb, service, message, createdAt: saved.created_at });
  } catch (err) {
    console.error('[quote] airtable write failed (lead still saved):', err);
  }

  // Optional photo → forward as an attachment on the instant alert (best effort).
  let attachment: Attachment | undefined;
  try {
    const photo = form.get('photo');
    if (
      photo instanceof File &&
      photo.size > 0 &&
      photo.size < 8_000_000 &&
      photo.type.startsWith('image/')
    ) {
      const buf = Buffer.from(await photo.arrayBuffer());
      attachment = { filename: photo.name || 'photo.jpg', content: buf.toString('base64') };
    }
  } catch (err) {
    console.error('[quote] photo read failed (ignored):', err);
  }

  // Instant alert — never fail the request if email hiccups; the lead is safe in the DB.
  try {
    await sendInstantAlert({ name, phone, suburb, service, message, id: saved.id, attachment });
  } catch (err) {
    console.error('[quote] instant alert failed (lead still saved):', err);
  }

  return json({ ok: true });
};

// A GET here is handy for a quick "is the endpoint alive?" check.
export const GET: APIRoute = () => json({ ok: true, endpoint: 'quote', method: 'POST' });
