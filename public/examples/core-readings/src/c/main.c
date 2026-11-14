#include <pebble.h>
#include <pebble-watchface-core/readings.h>

// This example owns keys 100..107. Reserve the complete eight-key range.
#define CACHE_FIRST_KEY 100
static WfcReadings s_readings;
static Window *s_window;
static TextLayer *s_text;
static char s_display[320];
static bool s_retry_request;

static int stored_size(void *context, uint32_t key) { (void)context; return persist_get_size(key); }
static int stored_read(void *context, uint32_t key, void *data, size_t length) { (void)context; return persist_read_data(key, data, length); }
static int stored_write(void *context, uint32_t key, const void *data, size_t length) { (void)context; return persist_write_data(key, data, length); }
static void stored_remove(void *context, uint32_t key) { (void)context; persist_delete(key); }

static void redraw(void *context) {
  (void)context;
  const time_t now = time(NULL);
  const ComplicationSlot *first = &s_readings.complications.slots[0];
  const ComplicationSlot *second = &s_readings.complications.slots[1];
  const char *a = s_readings.has_complications && complication_is_fresh(first, now) ? first->text : "No current first reading";
  const char *b = s_readings.has_complications && complication_is_fresh(second, now) ? second->text : "No current second reading";
  snprintf(s_display, sizeof(s_display), "%s\n\n%s", a, b);
  if (s_text) text_layer_set_text(s_text, s_display);
}

static void request_readings(void) {
  s_retry_request = true;
  if (!connection_service_peek_pebble_app_connection()) return;
  DictionaryIterator *outbox;
  if (app_message_outbox_begin(&outbox) != APP_MSG_OK) return;
  dict_write_uint8(outbox, MESSAGE_KEY_REQUEST_READINGS, 1);
  if (app_message_outbox_send() == APP_MSG_OK) {
    s_retry_request = false;
    wfc_readings_request_accepted(&s_readings, time(NULL));
  }
}
static void outbox_failed(DictionaryIterator *outbox, AppMessageResult reason, void *context) {
  (void)outbox; (void)reason; (void)context; s_retry_request = true;
}

static void received(DictionaryIterator *inbox, void *context) {
  (void)context;
  Tuple *data = dict_find(inbox, MESSAGE_KEY_COMPLICATION_DATA);
  if (!data) return; // Other host messages use this same dispatcher.
  if (data->type == TUPLE_BYTE_ARRAY) wfc_readings_receive(&s_readings, data->value->data, data->length, time(NULL));
  else wfc_readings_receive(&s_readings, NULL, 0, time(NULL)); // Invalid data clears stale state.
  redraw(NULL);
}
static void connected(bool value) {
  wfc_readings_connection_changed(&s_readings, value);
  redraw(NULL);
  if (value) request_readings();
}
static void minute_tick(struct tm *tick, TimeUnits units) {
  (void)tick; (void)units;
  const bool refresh = wfc_readings_tick(&s_readings, time(NULL));
  if (refresh || s_retry_request) request_readings();
  redraw(NULL);
}

static void load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(root);
  s_text = text_layer_create(GRect(8, 20, bounds.size.w - 16, bounds.size.h - 28));
  text_layer_set_font(s_text, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  text_layer_set_overflow_mode(s_text, GTextOverflowModeWordWrap);
  layer_add_child(root, text_layer_get_layer(s_text));
  redraw(NULL);
}
static void unload(Window *window) { (void)window; text_layer_destroy(s_text); s_text = NULL; }
int main(void) {
  WfcConfig config = {
    .storage = {.size=stored_size,.read=stored_read,.write=stored_write,.remove=stored_remove},
    .cache_first_key=CACHE_FIRST_KEY,.on_changed=redraw
  };
  wfc_readings_init(&s_readings, &config, connection_service_peek_pebble_app_connection());
  wfc_readings_load_cache(&s_readings, time(NULL));
  app_message_register_inbox_received(received);
  app_message_register_outbox_failed(outbox_failed);
  app_message_open(6144, 64);
  connection_service_subscribe((ConnectionHandlers){.pebble_app_connection_handler=connected});
  tick_timer_service_subscribe(MINUTE_UNIT, minute_tick);
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){.load=load,.unload=unload});
  window_stack_push(s_window, true);
  request_readings();
  app_event_loop();
  tick_timer_service_unsubscribe();
  connection_service_unsubscribe();
  app_message_deregister_callbacks();
  window_destroy(s_window);
}
