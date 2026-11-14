'use strict';

var summary = require('pebble-activities/summary');
var UUID = 'b8d3a905-5235-4e32-8d9b-b46e0559b0df';
var STATE_KEY = 'xoce.example.summary.demo.v1';
var ITEM_ID = 'manual-demo-1';

function initialState() {
  return {mode: 'message', text: 'Parcel at depot', deadline: null, seconds: 120, visibleUntil: null};
}
function readState(storage) {
  var raw = storage.getItem(STATE_KEY);
  if (raw === null || raw === undefined) return initialState();
  var state = JSON.parse(raw);
  if (!state || ['message', 'countdown', 'paused', 'none'].indexOf(state.mode) < 0 ||
      typeof state.text !== 'string' || !Number.isInteger(state.seconds) || state.seconds < 0 ||
      state.deadline !== null && (!Number.isInteger(state.deadline) || state.deadline < 1) ||
      state.visibleUntil !== null && (!Number.isInteger(state.visibleUntil) || state.visibleUntil < 1)) {
    throw Error('INVALID_DEMO_STATE');
  }
  return state;
}
function record(state) {
  if (state.mode === 'none') return null;
  var options = {name: 'Manual demo', icon: state.mode === 'message' ? 'delivery' : 'timer'};
  if (state.mode === 'message') options.headline = summary.text(state.text);
  else if (state.mode === 'countdown') options.headline = summary.countdown({deadline: state.deadline});
  else {
    options.headline = summary.countdown({seconds: state.seconds});
    options.state = 'paused';
  }
  if (state.visibleUntil !== null) options.visibleUntil = state.visibleUntil;
  return summary.standard(ITEM_ID, options);
}
function createProvider(storage, options) {
  options = options || {};
  return summary.defineProvider({
    pluginUuid: UUID, displayName: 'Activity Summary Demo', storage: storage,
    metadataKey: 'xoce.example.summary.publication.v1',
    // Short demo leases reduce waiting; these are suggestions, not SDK timers.
    refreshSeconds: 5, validitySeconds: 15, now: options.now || Date.now,
    readCurrent: function () {
      // This plugin owns its manually entered state. A saved native owner would
      // instead need defineSnapshotProvider and its original owner metadata.
      var current = record(readState(storage));
      return current ? [current] : [];
    }
  });
}
function createConfigHandler(storage, options) {
  var now = options && options.now || Date.now;
  return function (message, respond) {
    try {
      if (typeof message === 'string') message = JSON.parse(message);
      if (!message || message.type !== 'getDemo' && message.type !== 'setDemo') throw Error('INVALID_REQUEST');
      var state = readState(storage), time = Math.floor(now() / 1000);
      if (message.type === 'setDemo') {
        state.visibleUntil = null;
        if (message.action === 'message') {
          state.mode = 'message'; state.text = typeof message.text === 'string' ? message.text.trim() : '';
        } else if (message.action === 'countdown') {
          state.mode = 'countdown'; state.deadline = time + 120;
        } else if (message.action === 'pause' && state.mode === 'countdown') {
          state.seconds = Math.max(0, state.deadline - time); state.deadline = null; state.mode = 'paused';
        } else if (message.action === 'hide') state.mode = 'none';
        else if (message.action === 'expire') {
          state.mode = 'message'; state.text = 'This item expires'; state.visibleUntil = time + 15;
        } else throw Error('INVALID_REQUEST');
        var current = record(state);
        if (current && !summary.normalize(current, time)) throw Error('INVALID_DEMO_STATE');
        var encoded = JSON.stringify(state);
        storage.setItem(STATE_KEY, encoded);
        if (storage.getItem(STATE_KEY) !== encoded) throw Error('STORAGE_UNAVAILABLE');
      }
      respond({ok: true, state: state});
    } catch (error) {
      respond({ok: false, error: error && error.message || 'DEMO_UNAVAILABLE'});
    }
  };
}
module.exports = {createProvider: createProvider, createConfigHandler: createConfigHandler,
  UUID: UUID, STATE_KEY: STATE_KEY, ITEM_ID: ITEM_ID};
