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

export const faqs = [
  {
    q: 'Do you do emergencies?',
    a: "Yep — burst pipes, no hot water, blocked drains and the like. Give us a call and we'll get to you as fast as we can across the bay.",
  },
  {
    q: 'What areas do you cover?',
    a: "Birkdale and all of bayside Brisbane — Wellington Point, Cleveland, Capalaba, Victoria Point, Wynnum and the wider Redlands. Not sure if you're in? Just call and ask.",
  },
  {
    q: 'Do you give upfront quotes?',
    a: 'Always. We diagnose the problem and give you a clear price before any work starts — so there are no surprises when the invoice lands.',
  },
  {
    q: 'Are you certified & insured?',
    // Renders the licence/ABN when set in `business`; otherwise stays honest with no bracket.
    a: 'Yes — a fully licensed, certified and insured plumber on every job.',
  },
  {
    q: 'What does it cost to call you out?',
    a: "We'll always talk through the job and give you the price before we start, so a call-out never turns into a nasty surprise. No work goes ahead until you've okayed the number.",
  },
  {
    q: 'How do I pay?',
    a: "Easy — we'll sort the details when we book you in. Just give us a call and we'll let you know the options.",
  },
];

/** Credentials shown in the trust bar / About credentials grid. */
export const credentials = [
  {
    icon: 'shield',
    title: 'Certified plumber',
    body: 'A fully licensed, certified plumber on every job. Work done to code, and done to last.',
  },
  {
    icon: 'insured',
    title: 'Fully insured',
    body: "Covered work, so you're never carrying the risk. Peace of mind on every job.",
  },
  {
    icon: 'quote',
    title: 'Upfront fixed quotes',
    body: 'The price before the work starts. The number we say is the number you pay.',
  },
  {
    icon: 'pin',
    title: 'Local & responsive',
    body: 'Based right here in Birkdale. We answer the phone and we turn up.',
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
  // TODO: add real reviews, e.g.
  // { name: 'Jane D.', suburb: 'Cleveland', rating: 5, text: 'Turned up on time and sorted our hot water same day.' },
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
  // TODO: add real job photos, e.g.
  // { title: 'Hot water swap — Cleveland', after: '/images/job-1.jpg', alt: 'New hot water unit installed' },
];

/** Service options for the contact form dropdown. */
export const serviceOptions = [
  'Blocked drains & toilets',
  'Burst pipes & leaks',
  'Hot water systems',
  'Tap, toilet & cistern repairs',
  'Gas fitting',
  'General & maintenance plumbing',
  'Bathroom & renovation',
  'Something else',
];

/** Helper: a human licence/ABN string for footers, or null. */
export const credentialLine = (() => {
  const parts: string[] = [];
  if (business.licence) parts.push(`Licence ${business.licence}`);
  if (business.abn) parts.push(`ABN ${business.abn}`);
  return parts.length ? parts.join(' · ') : null;
})();
