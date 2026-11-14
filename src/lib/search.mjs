/**
 * @typedef {{ title: string, description: string, href: string, section: string, text?: string, status?: 'current' | 'historical' }} SearchEntry
 */

export const SEARCH_PAGE_SIZE = 9;

function normalize(value) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function words(value) {
  return value.match(/[\p{L}\p{N}]+/gu) ?? [];
}

function matchesToken(value, valueWords, token) {
  // Short terms such as UI must not match the middle of words such as build.
  return token.length <= 2 ? valueWords.some(word => word.startsWith(token)) : value.includes(token);
}

/** Rank complete title matches before incidental matches in article bodies.
 * @param {SearchEntry[]} entries
 * @param {string} query
 * @returns {SearchEntry[]}
 */
export function rankSearchEntries(entries, query) {
  const normalizedQuery = normalize(query);
  const tokens = words(normalizedQuery);
  if (!tokens.length) return normalizedQuery ? [] : [...entries];
  const wantsHistory = tokens.some(token => ['history', 'historical', 'archive', 'archived', 'legacy', 'old'].includes(token));

  return entries.flatMap((entry, index) => {
    const title = normalize(entry.title);
    const fields = [title, normalize(entry.description), normalize(entry.section), normalize(entry.text ?? '')];
    const fieldWords = fields.map(words);
    const hits = fields.map((field, fieldIndex) => tokens.filter(token => matchesToken(field, fieldWords[fieldIndex], token)).length);
    if (!tokens.every(token => fields.some((field, fieldIndex) => matchesToken(field, fieldWords[fieldIndex], token)))) return [];

    const exactTitleWords = tokens.filter(token => fieldWords[0].includes(token)).length;
    const titleTier = title === normalizedQuery ? 5
      : title.startsWith(normalizedQuery) ? 4
      : exactTitleWords === tokens.length ? 3
      : hits[0] === tokens.length ? 2
      : hits[0] ? 1 : 0;
    const currentReference = entry.status !== 'historical' || wantsHistory ? 1 : 0;
    return [{ entry, index, rank: [currentReference, titleTier, exactTitleWords, hits[0], hits[1], hits[2]] }];
  }).sort((a, b) => {
    for (let index = 0; index < a.rank.length; index++) {
      const difference = b.rank[index] - a.rank[index];
      if (difference) return difference;
    }
    return a.index - b.index;
  }).map(result => result.entry);
}

/** @param {SearchEntry[]} entries @param {string} query @param {number} [visibleCount] */
export function getSearchPage(entries, query, visibleCount = SEARCH_PAGE_SIZE) {
  const ranked = rankSearchEntries(entries, query);
  const count = Number.isFinite(visibleCount) ? Math.max(0, Math.floor(visibleCount)) : SEARCH_PAGE_SIZE;
  const matches = ranked.slice(0, count);
  return { matches, total: ranked.length, hasMore: matches.length < ranked.length };
}

/** @param {string} query @param {number} shown @param {number} total */
export function searchStatus(query, shown, total) {
  const displayQuery = query.trim();
  if (!total) return displayQuery ? 'No results. Try “timer”, “setup” or “activities”.' : 'No searchable pages are available.';
  const noun = displayQuery ? `result${total === 1 ? '' : 's'}` : `place${total === 1 ? '' : 's'} to start`;
  const count = shown < total ? `Showing ${shown} of ${total}` : String(total);
  return `${count} ${noun}${displayQuery ? ` for “${displayQuery}”` : '.'}`;
}
