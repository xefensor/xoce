'use strict';
const createHost = require('../src/pkjs/host');
const NOW = 1794657900;
const keys = {REQUEST_READINGS:9000, COMPLICATION_DATA:9001};
function fixture() {
  const subscriptions = [], packets = [], timers = new Map(), values = new Map();
  let timer = 0, now = NOW * 1000;
  const storage = {getItem:key => values.get(key) ?? null, setItem:(key,value) => values.set(key,value)};
  const pebble = {
    subscribeToSource(request) {
      const entry = {request,closed:false}; subscriptions.push(entry);
      return {unsubscribe() { entry.closed=true; }};
    },
    sendAppMessage(payload, success) { packets.push(JSON.parse(JSON.stringify(payload))); success(); }
  };
  const host = createHost(pebble, storage, {
    keys, now:() => now,
    later(fn) { timers.set(++timer,fn); return timer; }, cancelLater(id) { timers.delete(id); }
  });
  function preferences() {
    const request = subscriptions.findLast(entry => entry.request.category === 'preferences' && !entry.closed).request;
    request.onData({instances:[{instanceId:'0',properties:{
      category:{shortText:{text:'phone'}}, item:{shortText:{text:'phone_state'}},
      property:{shortText:{text:'battery_level'}}, index:{numericValue:{value:0}}
    }}]});
  }
  function source(value = 72) {
    const request = subscriptions.findLast(entry => entry.request.category === 'phone' && !entry.closed).request;
    request.onData({validUntilMs:NOW * 1000 + 60000,instances:[{
      instanceId:'phone',properties:{battery_level:{numericValue:{value,unit:'%'}}}
    }]});
  }
  return {host,subscriptions,packets,timers,values,preferences,source,setNow(value) { now=value; },
    packet() { return Buffer.from(packets.findLast(payload => payload[keys.COMPLICATION_DATA])[keys.COMPLICATION_DATA]); }};
}
module.exports = {fixture,NOW,keys};
