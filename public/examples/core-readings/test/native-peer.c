#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "readings.h"

#define FIRST_KEY 100
typedef struct {uint8_t bytes[8][256]; int sizes[8]; unsigned changes;} Store;
static int index_of(uint32_t key) {assert(key>=FIRST_KEY&&key<FIRST_KEY+8);return (int)(key-FIRST_KEY);}
static int size_of(void *ctx,uint32_t key) {return ((Store *)ctx)->sizes[index_of(key)];}
static int read_value(void *ctx,uint32_t key,void *data,size_t length) {
  Store *s=ctx;int i=index_of(key);if(s->sizes[i]<0)return -1;
  size_t n=(size_t)s->sizes[i]<length?(size_t)s->sizes[i]:length;memcpy(data,s->bytes[i],n);return (int)n;
}
static int write_value(void *ctx,uint32_t key,const void *data,size_t length) {
  Store *s=ctx;int i=index_of(key);assert(length<=256);memcpy(s->bytes[i],data,length);s->sizes[i]=(int)length;return (int)length;
}
static void remove_value(void *ctx,uint32_t key) {((Store *)ctx)->sizes[index_of(key)]=-1;}
static void changed(void *ctx) {((Store *)ctx)->changes++;}
int main(int argc,char **argv) {
  assert(argc==3);time_t now=(time_t)strtoll(argv[2],NULL,10);
  FILE *input=fopen(argv[1],"rb");assert(input);
  uint8_t bytes[COMPLICATION_MAX_BYTES];size_t length=fread(bytes,1,sizeof(bytes),input);assert(feof(input));fclose(input);
  Store store={0};for(unsigned i=0;i<8;i++)store.sizes[i]=-1;
  WfcConfig config={.storage={.context=&store,.size=size_of,.read=read_value,.write=write_value,.remove=remove_value},.cache_first_key=FIRST_KEY,.on_changed=changed,.context=&store};
  WfcReadings live;wfc_readings_init(&live,&config,true);
  assert(!wfc_readings_load_cache(&live,now));
  wfc_readings_request_accepted(&live,now);
  assert(wfc_readings_receive(&live,bytes,length,now));
  assert(live.has_complications);
  ComplicationSlot *first=&live.complications.slots[0];
  assert(complication_is_fresh(first,now));assert(first->numeric_value==72);
  const uint32_t received=first->confirmed_at,expiry=first->valid_until;
  assert(received==(uint32_t)now&&expiry>received&&expiry<=received+60);
  assert(store.changes>0);
  WfcReadings restored;wfc_readings_init(&restored,&config,true);
  assert(wfc_readings_load_cache(&restored,now+1));
  assert(restored.complications.slots[0].cached);
  assert(restored.complications.slots[0].confirmed_at==received);
  assert(restored.complications.slots[0].valid_until==expiry);
  assert(wfc_readings_connection_changed(&restored,false));
  assert(restored.complications.slots[0].valid_until==expiry);
  assert(wfc_readings_tick(&restored,expiry));
  assert(!complication_is_fresh(&restored.complications.slots[0],expiry));
  // Invalid bytes cannot leave the old live or cached value visible.
  bytes[4]^=1;assert(!wfc_readings_receive(&restored,bytes,length,now+2));
  assert(!restored.has_complications);
  for(unsigned i=0;i<8;i++)assert(store.sizes[i]<0);
  puts("Core JS/C host: decode, original cache lease, disconnect, expiry and invalid clear PASS");
}
