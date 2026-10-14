import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { siteTarget } from './scripts/site-target.mjs';
import { publishSeo } from './scripts/publish-seo.mjs';
import { fileURLToPath } from 'node:url';

const target = siteTarget();
const publishSearchMetadata = {
  name: 'hakaisatsu-publish-search-metadata',
  hooks: { 'astro:build:done': ({ dir }) => publishSeo(fileURLToPath(dir), target) },
};

export default defineConfig({
  site: target.site,
  base: target.base,
  outDir: target.outDir,
  output: 'static',
  publicDir: './.public',
  compressHTML: false,
  build: { format: 'file' },
  integrations: [react(), publishSearchMetadata],
  vite: { plugins: [tailwindcss()] },
});
