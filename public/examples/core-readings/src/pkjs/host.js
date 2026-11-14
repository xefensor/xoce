'use strict';
var core = require('pebble-watchface-core/readings');

// The host supplies one transport, one dispatcher, storage and clocks.
module.exports = function createHost(pebble, storage, options) {
  var send = core.createMessageQueue({
    keys: options.keys,
    send: function(payload, success, failure) { pebble.sendAppMessage(payload, success, failure); },
    later: options.later, cancelLater: options.cancelLater
  });
  var readings = core.createComplications({
    pebble: pebble, storage: storage, keys: options.keys, send: send,
    now: options.now, later: options.later, cancelLater: options.cancelLater,
    cacheKey: 'example-public-readings-v1',
    getSettings: function() { return {language:'en'}; }
  });
  return {
    ready: function() { readings.refresh(); },
    appmessage: function(event) {
      var payload = event && event.payload || {};
      if (payload.REQUEST_READINGS === 1 || payload[options.keys.REQUEST_READINGS] === 1) readings.refresh();
    },
    configured: function() { readings.configure(); },
    status: function() { return readings.status(); }
  };
};
