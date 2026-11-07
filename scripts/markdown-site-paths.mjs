import { sitePath } from '../src/lib/site.ts';

// Sätteri visitors change rendered URLs without changing article source,
// fragments, external URLs or code examples.
export default {
  name: 'xoce-site-paths',
  raw(node, context) {
    // Markdown permits raw HTML figures, including their native image sizes.
    const value = node.value.replace(/\b(href|src)=(['"])(\/(?!\/)[^'"]*)\2/g,
      (_, key, quote, url) => `${key}=${quote}${sitePath(url)}${quote}`);
    if (value !== node.value) context.replaceNode(node, { type: 'raw', value });
  },
  element: {
    filter: ['a', 'img'],
    visit(node, context) {
      for (const key of ['href', 'src']) {
        const value = node.properties?.[key];
        if (typeof value === 'string') context.setProperty(node, key, sitePath(value));
      }
    },
  },
};
