var keys = require('message_keys');
var createHost = require('./host');
var host = createHost(Pebble, localStorage, {
  keys: keys, now: function() { return Date.now(); },
  later: setTimeout, cancelLater: clearTimeout
});
Pebble.addEventListener('ready', host.ready);
Pebble.addEventListener('appmessage', host.appmessage);
