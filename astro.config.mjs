import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { basePath, siteOrigin } from './src/lib/site.ts';
import markdownSitePaths from './scripts/markdown-site-paths.mjs';

export default defineConfig({
  site: siteOrigin,
  base: basePath,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: {
    processor: satteri({ hastPlugins: [markdownSitePaths] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
