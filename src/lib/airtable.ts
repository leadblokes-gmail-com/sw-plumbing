/**
 * Mirror each website lead into Airtable so the client can view and manage leads
 * in a simple grid + phone app (the "easy DB"). Best-effort by design:
 *   - if AIRTABLE_TOKEN isn't set, this silently no-ops (feature off), and
 *   - if the API call fails, the caller swallows it —
 * the lead is already safe in Postgres and goes out on the instant email alert.
 * This never blocks or fails the /api/quote response.
 *
 * Env:
 *   AIRTABLE_TOKEN    — Airtable Personal Access Token, scope `data.records:write`
 *                       (required to actually write; absent = feature simply off)
 *   AIRTABLE_BASE_ID  — base id (default: the "S&W Plumbing – Leads" base)
 *   AIRTABLE_TABLE    — table name (default: "Leads")
 *
 * Field names below MUST match the Airtable columns exactly:
 *   Name, Phone, Suburb, Service, Message, Date, Status
 *
 * Note on Photo: the "Photo" attachment column is intentionally NOT populated here.
 * Airtable attachments require a public URL, and customer-uploaded photos aren't
 * hosted anywhere public — the instant email alert carries the actual photo instead.
 * Add Vercel Blob (or similar) hosting later to fill Photo too.
 */

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appsrrbGxnnTaLT7l';
const TABLE = process.env.AIRTABLE_TABLE || 'Leads';

/** Is the Airtable mirror switched on (i.e. is a token configured)? */
export const airtableEnabled = (): boolean => Boolean(process.env.AIRTABLE_TOKEN);

export async function sendToAirtable(l: {
  name: string;
  phone: string;
  suburb?: string;
  service?: string;
  message?: string;
  createdAt?: string; // ISO 8601; defaults to now
}): Promise<void> {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return; // feature off until the token is set

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`;

  const fields: Record<string, unknown> = {
    Name: l.name,
    Phone: l.phone,
    Date: l.createdAt || new Date().toISOString(),
    Status: 'New',
  };
  if (l.suburb) fields.Suburb = l.suburb;
  if (l.service) fields.Service = l.service;
  if (l.message) fields.Message = l.message;

  // typecast:true lets Airtable match the "New" single-select option by name and
  // coerce text fields, so we don't need the option's internal id.
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Airtable write failed (${res.status}): ${body}`);
  }
}
