/** Public GitHub Pages location. Keep templates, Markdown and checks in sync. */
export const siteOrigin = 'https://xefensor.github.io';
export const basePath = '/xoce/';

export function sitePath(value: string): string;
export function sitePath(value: string | undefined): string | undefined;
export function sitePath(value: string | undefined): string | undefined {
  if (!value?.startsWith('/') || value.startsWith('//')) return value;
  if (value === basePath.slice(0, -1) || value.startsWith(basePath)) return value;
  return basePath.slice(0, -1) + value;
}

/** Compare request paths with the canonical routes stored in catalogue data. */
export function routePath(value: string): string {
  return value.startsWith(basePath) ? '/' + value.slice(basePath.length) : value;
}
