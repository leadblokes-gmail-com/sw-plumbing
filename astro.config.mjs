import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// Update `site` to the production domain before deploy (used for sitemap + canonical URLs + JSON-LD).
export default defineConfig({
  site: 'https://swplumbing.com.au',
  // Hybrid: every page is still statically prerendered (fast + cheap). Only the
  // API routes that opt out with `export const prerender = false` (the quote
  // handler + the weekly-digest cron) run as Vercel serverless functions.
  output: 'hybrid',
  adapter: vercel(),
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    // Allow sharing the local preview through a tunnel URL (Cloudflare/ngrok/etc).
    preview: {
      allowedHosts: true,
    },
  },
});
