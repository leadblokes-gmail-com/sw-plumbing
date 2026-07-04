/**
 * Central content + business data for S & W Plumbing.
 * Edit real-world values here — pages/components read from this file
 * so there is a single source of truth (no hardcoded hex/strings per page).
 */

export const business = {
  name: 'S & W Plumbing',
  shortName: 'S&W Plumbing',
  tagline: "Bayside Brisbane's plumbing, done properly.",
  phone: '0432 292 371',
  phoneHref: 'tel:0432292371',
  email: 'swplumbing@gmail.com',
  emailHref: 'mailto:swplumbing@gmail.com',
  baseSuburb: 'Birkdale',
  state: 'QLD',
  region: 'Bayside Brisbane & the Redlands',
  facebook: 'https://www.facebook.com/people/S-W-Plumbing/61555117598812/',
  hours: 'Call to arrange',

  // ⚠️ TODO (real data needed from client): fill these to remove the placeholders.
  // When null, the site renders honestly ("Licensed & qualified") instead of
  // showing a visible [bracket]. See README → "Real-data checklist".
  licence: null as string | null, // TODO: real plumbing licence number
  abn: null as string | null, // TODO: real ABN
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Contact', href: '/contact' },
];

/** Services shown on Home (short) and Services page (with detail lists). `icon` keys map to ServiceCard SVGs. */
export interface Service {
  icon: string;
  title: string;
  homeTitle?: string;
  short: string;
  blurb: string;
  details: string[];
}
export const services: Service[] = [
  {
    icon: 'drain',
    title: 'Blocked drains & toilets',
    homeTitle: 'Blocked drains',
    short: 'Cleared fast and properly — back to flowing.',
    blurb: 'Cleared fast — sinks, showers and sewer lines back to flowing.',
    details: [
      'Blocked sinks, showers & floor wastes',
      'Blocked toilets & sewer lines',
      'Recurring blockages diagnosed at the cause',
    ],
  },
  {
    icon: 'leak',
    title: 'Burst pipes & leak detection',
    homeTitle: 'Burst pipes & leaks',
    short: 'Stop the damage and the rising water bill.',
    blurb: 'Leak detection and repairs that stop the damage and the water bill.',
    details: [
      'Burst & leaking pipes isolated and repaired',
      'Hidden & underground leak detection',
      'Water hammer & pressure issues sorted',
    ],
  },
  {
    icon: 'hotwater',
    title: 'Hot water systems',
    short: 'Repairs & installs — back to hot showers.',
    blurb: 'Repairs and installs — back to hot showers without the wait.',
    details: [
      'Electric & gas system repairs',
      'New system supply & installation',
      'Leaking tanks & no-hot-water call-outs',
    ],
  },
  {
    icon: 'tap',
    title: 'Tap, toilet & cistern repairs',
    homeTitle: 'Taps & toilets',
    short: 'No more drips, runs or wobbly handles.',
    blurb: 'Dripping taps, running toilets and cisterns — sorted properly.',
    details: [
      'Dripping taps & worn washers',
      'Running & leaking toilets & cisterns',
      'Mixer & tapware replacement',
    ],
  },
  {
    icon: 'gas',
    title: 'Gas fitting & appliances',
    homeTitle: 'Gas fitting',
    short: 'Certified gas work, done safely and to code.',
    blurb: 'Gas appliances and fittings handled safely and to code.',
    details: [
      'Gas cooktops & appliance connections',
      'Gas hot water & line installs',
      'Gas leak checks & safety',
    ],
  },
  {
    icon: 'maintenance',
    title: 'General & maintenance plumbing',
    homeTitle: 'General maintenance',
    short: 'The ongoing jobs that keep a place running.',
    blurb: 'The ongoing odd jobs that keep your home or business running.',
    details: [
      'General repairs & odd jobs',
      'Ongoing property maintenance',
      'Rentals & landlords looked after',
    ],
  },
  {
    icon: 'bathroom',
    title: 'Bathroom & renovation plumbing',
    short: 'Rough-in to fit-off for your reno.',
    blurb: 'Rough-in to fit-off plumbing for your bathroom or laundry reno.',
    details: [
      'Bathroom & laundry rough-in',
      'Fixture & fitting fit-off',
      'Basins, showers & vanities',
    ],
  },
  {
    icon: 'roof',
    title: 'Leaking roofs & gutters',
    short: 'Stormwater and roof leaks kept out.',
    blurb: 'Roof leak investigation, gutter and stormwater repairs.',
    details: [
      'Roof leak investigation & repair',
      'Gutter & downpipe repairs',
      'Stormwater & drainage',
    ],
  },
];

/** Problem-led cards for the Home "What can we help with?" section. */
export const problems = [
  { icon: 'tap', title: 'Leaking taps', blurb: 'Dripping taps and worn washers fixed for good.' },
  { icon: 'leak', title: 'Burst pipes', blurb: 'Burst and leaking pipes isolated and repaired fast.' },
  { icon: 'bathroom', title: 'Toilet repairs', blurb: 'Running, leaking or blocked toilets sorted properly.' },
  { icon: 'hotwater', title: 'Hot water issues', blurb: 'No hot water or a leaking unit? Repairs and installs.' },
  { icon: 'roof', title: 'Outdoor taps & fittings', blurb: 'Garden taps, hose fittings and outdoor plumbing.' },
  { icon: 'maintenance', title: 'Pipework & maintenance', blurb: 'Ongoing repairs and the jobs that keep things running.' },
  { icon: 'drain', title: 'Blocked drains', blurb: 'Sinks, showers and sewer lines back to flowing.' },
  { icon: 'check', title: 'General plumbing repairs', blurb: 'The everyday plumbing issues, handled cleanly.' },
];

export const faqs = [
  {
    q: 'What plumbing services do you offer?',
    a: 'Blocked drains and toilets, burst pipes and leaks, hot water repairs and installs, taps, toilets and cisterns, gas fitting, roof and gutter leaks, and general maintenance plumbing for homes, rentals and small businesses.',
  },
  {
    q: 'Do you service my suburb?',
    a: "We're based near Birkdale and cover Bayside Brisbane and the Redlands — Wellington Point, Cleveland, Capalaba, Victoria Point, Wynnum and nearby. Not sure if you're in the area? Give us a call and we'll let you know.",
  },
  {
    q: 'Do you provide pricing before work starts?',
    a: "Yes. We look at the job, explain what's involved and give you a clear price before any work begins — so you know the number before we start.",
  },
  {
    q: 'Can I call for urgent issues?',
    a: "Call anytime and we'll talk it through. For urgent problems like a burst pipe or no hot water, phoning is the fastest way to get a time sorted.",
  },
  {
    q: 'Do you do small jobs?',
    a: "Absolutely — a dripping tap, a running toilet or a single outdoor fitting are all worth a call. No job is too small.",
  },
];

/**
 * "Proof over promises" cards — the honest trust points shown on Home + About.
 * Deliberately avoids licensed/insured/certified claims until real proof exists;
 * add those back once a licence number and insurance are confirmed in `business`.
 */
export const credentials = [
  {
    icon: 'quote',
    title: 'Clear pricing before work starts',
    body: 'We explain the job and give you the price before any work begins — no surprises on the invoice.',
  },
  {
    icon: 'shield',
    title: 'Clean, tidy work',
    body: 'We treat your place with respect and leave it as we found it — tidied up and sorted.',
  },
  {
    icon: 'pin',
    title: 'Local to Birkdale',
    body: 'Based near Birkdale and working across Bayside Brisbane and the Redlands.',
  },
  {
    icon: 'insured',
    title: 'Business details available on request',
    body: 'Licence and insurance details can be provided when you get in touch.',
  },
];

/** Suburbs served. `hq` marks the home base. Pin x/y are stylised map positions (0–100%). */
export const suburbs = [
  { name: 'Birkdale', hq: true, x: 50, y: 36 },
  { name: 'Wynnum', x: 58, y: 9 },
  { name: 'Manly', x: 62, y: 17 },
  { name: 'Lota', x: 60, y: 25 },
  { name: 'Thorneside', x: 44, y: 28 },
  { name: 'Capalaba', x: 29, y: 40 },
  { name: 'Ormiston', x: 64, y: 43 },
  { name: 'Wellington Point', x: 74, y: 37 },
  { name: 'Alexandra Hills', x: 43, y: 51 },
  { name: 'Sheldon', x: 23, y: 57 },
  { name: 'Cleveland', x: 70, y: 55 },
  { name: 'Thornlands', x: 57, y: 64 },
  { name: 'Victoria Point', x: 66, y: 73 },
  { name: 'Redland Bay', x: 55, y: 85 },
];

/**
 * Customer reviews. EMPTY by design — this is a new business with no reviews yet
 * (see About page copy). The Reviews component auto-hides while this is empty so
 * we never ship fake social proof. Paste real Google/Facebook reviews here to
 * switch the block on across Home + Contact.
 *
 * Shape: { name: string, suburb: string, rating: 1-5, text: string }
 * Optionally set googleRating + googleCount once a Google Business Profile exists.
 */
export const reviews: { name: string; suburb: string; rating: number; text: string }[] = [
  // Intentionally EMPTY. This is a new business — no fabricated testimonials.
  // Paste real Google/Facebook reviews here (name + suburb + their words) to
  // switch the Reviews block on across Home + Contact + About. Until then the
  // site shows "Proof over promises" instead of fake social proof.
];

export const googleRating: { rating: number; count: number } | null = null; // TODO: set once GBP is live

/**
 * Real job photos / before-after gallery. EMPTY by design (no stock photos).
 * The JobGallery component auto-hides until real photos are added here.
 * Put image files in /public/images and reference them by path.
 *
 * Shape: { title: string, before?: string, after: string, alt: string }
 */
export const jobs: { title: string; before?: string; after: string; alt: string }[] = [
  // Intentionally EMPTY — no stock photos posing as real jobs. The JobGallery
  // auto-hides until genuine S&W job photos are added here. Put real image files
  // in /public/images and reference them by path when available.
];

/** "Choose your problem" options for the quote form dropdown. */
export const serviceOptions = [
  'Leaking Tap / Toilet',
  'Leaking Pipe',
  'Blocked Drain',
  'Hot Water',
  'Gas Fitting',
  'Appliance Installation',
  'Emergency Plumbing',
  'Other',
];

/** Helper: a human licence/ABN string for footers, or null. */
export const credentialLine = (() => {
  const parts: string[] = [];
  if (business.licence) parts.push(`Licence ${business.licence}`);
  if (business.abn) parts.push(`ABN ${business.abn}`);
  return parts.length ? parts.join(' · ') : null;
})();
