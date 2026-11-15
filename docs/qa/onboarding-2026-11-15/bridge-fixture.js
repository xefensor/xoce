// Isolated synthetic Pebble bridge; capture=1 hides only the added disclosure.
function syntheticBridge(app,packets) {
  const params=new URLSearchParams(location.search),language=params.get('lang')==='cs'?'cs':'en';
  const platform=params.get('platform')==='gabbro'?'gabbro':'emery';
  if(params.get('capture')==='1') {
    const hideAddedNote=()=>{const note=document.querySelector('[data-xoce-capture-note]');if(note)note.style.display='none';};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hideAddedNote,{once:true});else hideAddedNote();
  }
  const clone=value=>JSON.parse(JSON.stringify(value));
  try{Object.defineProperty(navigator,'language',{configurable:true,get:()=>language});}catch(ignored){}
  const packet=clone(packets[language]);packet.platform=platform;
  const delivery={state:'pending',applied:false,pending:true};
  const state=window.__xoceCaptureFixture={synthetic:true,app,language,platform,requests:[],phoneSaves:0,watchReceipt:false};
  function update(items) {
    for(const item of items) {
      if(item.items)update(item.items);
      if(item.messageKey&&Object.prototype.hasOwnProperty.call(packet.settings,item.messageKey))
        item.defaultValue=typeof packet.settings[item.messageKey]==='object'?JSON.stringify(packet.settings[item.messageKey]):packet.settings[item.messageKey];
    }
  }
  window.Pebble={
    platform:'config',getActiveWatchInfo:()=>({platform,language}),targets:()=>Promise.resolve([{id:'plugin'}]),
    addEventListener(name,callback){if(name==='ready'){const ready=()=>callback({target:'plugin'});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else setTimeout(ready,0);}},
    sendMessage(target,message) {
      state.requests.push({target,type:message.type});
      return new Promise((resolve,reject)=>setTimeout(()=>{
        if(target!=='plugin'){reject(Error('No real phone runtime in this fixture'));return;}
        if(message.type==='load_settings'){resolve(clone(packet));return;}
        if(message.type==='save_settings'){
          packet.settings=clone(message.settings);packet.values=clone(message.settings);update(packet.config);state.phoneSaves++;
          resolve({ok:true,settings:clone(packet.settings),delivery:clone(delivery)});return;
        }
        if(message.type==='display_status'||message.type==='retry_display'){
          resolve({ok:true,settings:clone(packet.settings),delivery:clone(delivery)});return;
        }
        reject(Error('Unsupported isolated bridge request: '+message.type));
      },message.type==='save_settings'?350:60));
    }
  };
  window.fetch=()=>Promise.reject(Error('Fixture networking disabled'));
  window.XMLHttpRequest=function(){throw Error('Fixture networking disabled');};
}
