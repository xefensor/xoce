export type DesignReferenceVariant = 'website' | 'patterns' | 'pebble';

export const designReferenceHeadings: Record<DesignReferenceVariant, { depth: number; slug: string; text: string }[]> = {
  website: [{ depth: 2, slug: 'website-reference', text: 'Website specimens' }],
  patterns: [{ depth: 2, slug: 'pattern-examples', text: 'Current interface examples' }],
  pebble: [{ depth: 2, slug: 'native-reference-examples', text: 'Native compositions' }],
};
