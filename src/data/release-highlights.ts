import type { Project } from './projects';

interface ReleaseHighlights {
  reviewedTag: string;
  source: string;
  changes: readonly [string, string] | readonly [string, string, string];
}

// Summaries of these exact public release notes, not earlier feature releases.
export const releaseHighlights: Record<string, ReleaseHighlights> = {
  dynamic: {
    reviewedTag: 'v1.0.2',
    source: 'https://github.com/xefensor/pebble-watchface-dynamic/releases/tag/v1.0.2',
    changes: [
      'Clearer settings help and more stable status messages.',
      'Colour palettes work better with a keyboard, and layout previews are labelled.',
    ],
  },
  halftone: {
    reviewedTag: 'v1.10.3',
    source: 'https://github.com/xefensor/halftone-watchface/releases/tag/v1.10.3',
    changes: [
      'Colour palettes work better with a keyboard, and preview panels are labelled.',
      'More reliable settings status and Retry feedback.',
    ],
  },
  timer: {
    reviewedTag: 'v1.0.3',
    source: 'https://github.com/xefensor/pebble-app-timer/releases/tag/v1.0.3',
    changes: [
      'Delayed delivery checks no longer interrupt settings edits or Save.',
      'Watch display and Alarm sound have clearer, separate save controls.',
      'New launcher icon and clearer appearance choices.',
    ],
  },
  dashboard: {
    reviewedTag: 'v1.0.2',
    source: 'https://github.com/xefensor/pebble-app-dashboard/releases/tag/v1.0.2',
    changes: [
      'Late delivery checks no longer interrupt settings edits or Save.',
      'Shorter setup help and fewer repeated status announcements.',
      'Clearer appearance choices keep your saved Light or Dark preference.',
    ],
  },
  'open-activity': {
    reviewedTag: 'v1.0.2',
    source: 'https://github.com/xefensor/pebble-app-open-activity/releases/tag/v1.0.2',
    changes: [
      'Fixed a case where settings could stay stuck on “Saving”.',
      'More reliable delivery feedback when editing, saving or reloading settings.',
      'Clearer setup help and appearance choices.',
    ],
  },
  'chmu-weather': {
    reviewedTag: 'v1.0.4',
    source: 'https://github.com/xefensor/pebble-chmu-weather/releases/tag/v1.0.4',
    changes: [
      'Saving settings and refreshing weather are more clearly separated.',
      'Station and source changes keep location context without showing readings from the previous selection.',
      'Improved keyboard focus and clearer forecast UV guidance.',
    ],
  },
};

export function highlightsForProject(project: Pick<Project, 'slug' | 'name' | 'version' | 'tag' | 'repo' | 'publication'>): ReleaseHighlights | undefined {
  if (project.publication !== 'published') return undefined;
  const highlights = releaseHighlights[project.slug];
  const expectedSource = `${project.repo?.replace(/\/$/, '')}/releases/tag/${project.tag}`;
  if (!highlights || !project.version || project.tag !== `v${project.version}` || highlights.reviewedTag !== project.tag || highlights.source !== expectedSource) {
    throw new Error(`Review release highlights for ${project.name} ${project.tag ?? '(missing tag)'} against its exact public release notes.`);
  }
  return highlights;
}
