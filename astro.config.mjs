import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain before deploy (used for sitemap + canonical URLs + JSON-LD).
export default defineConfig({
  site: 'https://swplumbing.com.au',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
