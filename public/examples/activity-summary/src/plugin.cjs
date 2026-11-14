'use strict';

var demo = require('./provider.cjs');
var provider = demo.createProvider(localStorage);
var sourceQueue = Promise.resolve();

// Serialize this provider's SDK requests. Only actual dispatched reads publish;
// there is no polling timer, network request or watch-app launch in this plugin.
Pebble.registerSourceHandler(function (request, respond) {
  function read() { return provider.handleSource(request, respond); }
  var pending = sourceQueue.then(read, read);
  sourceQueue = pending.catch(function () {});
  return pending;
});
if (typeof Pebble.registerConfigHandler === 'function') {
  Pebble.registerConfigHandler(demo.createConfigHandler(localStorage));
}
