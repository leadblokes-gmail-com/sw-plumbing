/**
 * GET /api/cron/weekly-digest — emails S&W a summary of the week's quote requests.
 *
 * Triggered by Vercel Cron (see vercel.json → crons). Vercel automatically sends
 * an `Authorization: Bearer <CRON_SECRET>` header when CRON_SECRET is set, so we
 * reject anyone who isn't the scheduler (or a manual call with the secret).
 *
 * Schedule: "0 21 * * 0" (UTC) = Monday 07:00 Brisbane time.
 */
import type { APIRoute } from 'astro';
import { ensureSchema, getLeadsSince } from '../../../lib/leads';
import { sendWeeklyDigest } from '../../../lib/email';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    await ensureSchema();
    const leads = await getLeadsSince(7);
    await sendWeeklyDigest(leads);
    return new Response(JSON.stringify({ ok: true, count: leads.length }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('[cron] weekly digest failed:', err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
