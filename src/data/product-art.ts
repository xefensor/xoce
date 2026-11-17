// Fresh website compositions; real app screens remain separate capture assets.
export const productArt = Object.fromEntries([
  'dynamic', 'halftone', 'timer', 'dashboard', 'open-activity', 'chmu-weather',
].map(slug => [slug, {
  stage: `/images/product-art/${slug}-stage.svg`,
  tile: `/images/product-art/${slug}-tile.svg`,
}])) as Record<string, { stage: string; tile: string }>;
