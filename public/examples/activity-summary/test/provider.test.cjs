'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const summary = require('pebble-activities/summary');
const demo = require('../src/provider.cjs');

function setup() {
  const values = new Map();
  const storage = {getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value))};
  let time = 1800000000000;
  const options = {now: () => time};
  const provider = demo.createProvider(storage, options);
  const configure = demo.createConfigHandler(storage, options);
  return {storage, values, provider, advance(seconds) {time += seconds * 1000;},
    set(action, text) {let response; configure({type: 'setDemo', action, text}, value => {response = value;}); assert.equal(response.ok, true); return response.state;},
    async read(request = {category: 'activity', item: 'summary'}) {
      let response, failure;
      await provider.handleSource(request, {data(value) {response = value;}, error(code) {failure = code;}});
      if (failure) throw Error(failure);
      return response;
    }};
}
function content(response) {
  const item = response.instances.find(instance => instance.instanceId === demo.ITEM_ID);
  return item ? JSON.parse(item.properties.content.longText.text) : null;
}
function header(response) {return response.instances.find(item => item.instanceId === '@snapshot').properties;}

test('real 0.4.4 helper declares only summary and publishes a stable item, update and complete withdrawal', async () => {
  const owner = setup();
  assert.deepEqual(owner.provider.sourceDeclaration.items, ['summary']);
  assert.deepEqual(owner.provider.sourceDeclaration.properties, summary.SOURCE_PROPERTIES);
  const first = await owner.read();
  assert.equal(content(first).id, demo.ITEM_ID); assert.equal(content(first).headline.text, 'Parcel at depot');
  assert.equal(header(first).activity_count.numericValue.value, 1);
  owner.set('message', 'Driver nearby'); owner.advance(1);
  const updated = await owner.read();
  assert.equal(content(updated).id, content(first).id); assert.equal(content(updated).headline.text, 'Driver nearby');
  assert.ok(header(updated).snapshot_sequence.numericValue.value > header(first).snapshot_sequence.numericValue.value);
  owner.set('hide');
  const empty = await owner.read();
  assert.equal(content(empty), null); assert.equal(empty.instances.length, 1);
  assert.equal(header(empty).activity_count.numericValue.value, 0);
});

test('running reads retain the original deadline; pausing publishes fixed seconds without inventing completion', async () => {
  const owner = setup(), state = owner.set('countdown');
  const first = await owner.read(); assert.equal(content(first).headline.deadline, state.deadline);
  owner.advance(10);
  assert.equal(content(await owner.read()).headline.deadline, state.deadline);
  const paused = owner.set('pause'); assert.equal(paused.seconds, 110);
  const fixed = content(await owner.read());
  assert.equal(fixed.state, 'paused'); assert.deepEqual(fixed.headline, {type: 'clock', mode: 'countdown', seconds: 110});
  owner.advance(40); assert.deepEqual(content(await owner.read()).headline, fixed.headline);
  owner.set('countdown'); owner.advance(121);
  assert.equal(content(await owner.read()).state, 'active', 'zero is not an owner completion receipt');
});

test('an absolute visibleUntil expires the item without renewal on repeated fresh reads', async () => {
  const owner = setup(), state = owner.set('expire');
  const first = await owner.read();
  assert.equal(content(first).visibleUntil, state.visibleUntil);
  owner.advance(10);
  const later = await owner.read();
  assert.equal(content(later).visibleUntil, state.visibleUntil);
  assert.equal(later.instances[1].properties.valid_until.timestamp.value, state.visibleUntil);
  owner.advance(6);
  assert.equal(content(await owner.read()), null);
});

test('source requests reject unsupported items and storage failures do not produce successful data', async () => {
  const owner = setup();
  await assert.rejects(owner.read({category: 'activity', item: 'live'}), /INVALID_REQUEST/);
  assert.equal(owner.values.size, 0);
  owner.storage.setItem = () => {throw Error('quota');};
  await assert.rejects(owner.read());
});

test('configuration validates content and requires exact storage readback before reporting success', () => {
  const owner = setup(), handler = demo.createConfigHandler(owner.storage);
  let response;
  handler({type: 'setDemo', action: 'message', text: 'line\nbreak'}, value => {response = value;});
  assert.equal(response.ok, false); assert.equal(owner.values.has(demo.STATE_KEY), false);
  owner.storage.setItem = () => {};
  handler({type: 'setDemo', action: 'message', text: 'Valid message'}, value => {response = value;});
  assert.equal(response.ok, false); assert.equal(response.error, 'STORAGE_UNAVAILABLE');
});
