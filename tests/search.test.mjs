import test from 'node:test';
import assert from 'node:assert/strict';
import { rankSearchEntries, getSearchPage, searchStatus, SEARCH_PAGE_SIZE } from '../src/lib/search.mjs';

function entry(title, overrides = {}) {
  return { title, description: '', section: 'Docs', href: `/docs/${title.toLowerCase().replaceAll(' ', '-')}/`, ...overrides };
}

test('exact titles, title prefixes and title words outrank descriptions and article text', () => {
  const entries = [
    entry('Building', { text: 'Use Core in the app.' }),
    entry('Readings', { description: 'Core integration and settings.' }),
    entry('Integrate Core'),
    entry('Core for PebbleOS'),
    entry('Core'),
  ];
  assert.deepEqual(rankSearchEntries(entries, 'core').map(result => result.title), [
    'Core', 'Core for PebbleOS', 'Integrate Core', 'Readings', 'Building',
  ]);
});

test('UI guides remain discoverable after more than nine incidental build matches', () => {
  const unrelated = Array.from({ length: 12 }, (_, index) => entry(`Product ${index}`, {
    description: 'Build the current sources.', text: 'Required build instructions and suite checks.',
  }));
  const uiPatterns = entry('UI patterns');
  const nativeStandard = entry('Pebble UI and UX standard');
  const page = getSearchPage([...unrelated, nativeStandard, uiPatterns], 'UI');
  assert.deepEqual(page.matches, [uiPatterns, nativeStandard]);
  assert.equal(page.total, 2);
  assert.equal(page.hasMore, false);
});

test('current references lead ordinary searches while explicit historical searches still find archives', () => {
  const historical = entry('Historical UI patterns', { status: 'historical', text: 'Archived patterns.' });
  const current = entry('Interface patterns', { text: 'Current UI patterns and their historical context.' });
  assert.deepEqual(rankSearchEntries([historical, current], 'UI'), [current, historical]);
  assert.deepEqual(rankSearchEntries([current, historical], 'historical UI patterns'), [historical, current]);
});

test('all query words must match, including queries spanning title and description', () => {
  const mixed = entry('Timer', { description: 'Setup and configuration help.' });
  const exact = entry('Timer setup');
  const wrong = entry('Timer controls', { text: 'Pause and resume.' });
  assert.deepEqual(rankSearchEntries([wrong, mixed, exact], 'timer setup'), [exact, mixed]);
});

test('matching ignores case, accents and repeated whitespace while preserving original entries', () => {
  const weather = entry('ČHMÚ Weather', { href: '/projects/chmu-weather/' });
  const original = [weather];
  assert.deepEqual(rankSearchEntries(original, '  CHMU   weather  '), original);
  assert.strictEqual(rankSearchEntries(original, 'chmu')[0], weather);
  assert.equal(weather.title, 'ČHMÚ Weather');
});

test('title prefixes support partial queries and equal-ranked results keep their source order', () => {
  const first = entry('Timer alarm');
  const second = entry('Timer controls');
  const body = entry('Watchface', { text: 'A timer remains visible.' });
  assert.deepEqual(rankSearchEntries([body, first, second], 'tim'), [first, second, body]);
});

test('paging retains the full count and exposes every result without changing its order', () => {
  const entries = Array.from({ length: 23 }, (_, index) => entry(`Guide ${index}`, { text: 'setup' }));
  const first = getSearchPage(entries, 'setup');
  assert.equal(SEARCH_PAGE_SIZE, 9);
  assert.deepEqual(first.matches, entries.slice(0, 9));
  assert.equal(first.total, 23);
  assert.equal(first.hasMore, true);
  const next = getSearchPage(entries, 'setup', 18);
  assert.deepEqual(next.matches, entries.slice(0, 18));
  assert.equal(next.total, 23);
  assert.equal(next.hasMore, true);
  const all = getSearchPage(entries, 'setup', 27);
  assert.deepEqual(all.matches, entries);
  assert.equal(all.total, 23);
  assert.equal(all.hasMore, false);
  assert.deepEqual(entries.map(result => result.title), Array.from({ length: 23 }, (_, index) => `Guide ${index}`));
});

test('empty queries preserve starting order and zero matches do not expose a more button', () => {
  const entries = [entry('Timer'), entry('Core')];
  assert.deepEqual(rankSearchEntries(entries, '  '), entries);
  assert.deepEqual(getSearchPage(entries, 'nonexistent'), { matches: [], total: 0, hasMore: false });
  assert.deepEqual(rankSearchEntries(entries, '!!!'), []);
});

test('status reports actual totals, singular results and remaining starting pages', () => {
  assert.equal(searchStatus('UI', 9, 23), 'Showing 9 of 23 results for “UI”');
  assert.equal(searchStatus('UI', 23, 23), '23 results for “UI”');
  assert.equal(searchStatus('Core', 1, 1), '1 result for “Core”');
  assert.equal(searchStatus('', 9, 23), 'Showing 9 of 23 places to start.');
  assert.equal(searchStatus('', 1, 1), '1 place to start.');
  assert.equal(searchStatus('missing', 0, 0), 'No results. Try “timer”, “setup” or “activities”.');
  assert.equal(searchStatus('', 0, 0), 'No searchable pages are available.');
});
