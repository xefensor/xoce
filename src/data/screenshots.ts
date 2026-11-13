import launchScreenshots from './launch-screenshots.json' with { type: 'json' };
export type Screenshot = { image: string; title: string; caption: string; alt: string; kind: 'watch' | 'phone'; version: string; width: number; height: number; source: string; platform: string };
export const screenshotGalleries = launchScreenshots as Record<string, Screenshot[]>;
