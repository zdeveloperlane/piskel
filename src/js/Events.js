// TODO(grosbouddha): put under pskl namespace.
var Events = {

  TOOL_SELECTED : "TOOL_SELECTED",
  SELECT_TOOL : "SELECT_TOOL",

  TOOL_RELEASED : "TOOL_RELEASED",
  SELECT_PRIMARY_COLOR: "SELECT_PRIMARY_COLOR",
  SELECT_SECONDARY_COLOR: "SELECT_SECONDARY_COLOR",
  PRIMARY_COLOR_SELECTED : 'PRIMARY_COLOR_SELECTED',
  SECONDARY_COLOR_SELECTED : 'SECONDARY_COLOR_SELECTED',

  CURSOR_MOVED : 'CURSOR_MOVED',
  DRAG_START : 'DRAG_START',
  DRAG_END : 'DRAG_END',

  DIALOG_DISPLAY : 'DIALOG_DISPLAY',
  DIALOG_HIDE : 'DIALOG_HIDE',

  PALETTE_LIST_UPDATED : 'PALETTE_LIST_UPDATED',

  /**
   * Fired each time a user setting change.
   * The payload will be:
   *   1st argument: Name of the settings
   *   2nd argument: New value
   */
  USER_SETTINGS_CHANGED: "USER_SETTINGS_CHANGED",

  CLOSE_SETTINGS_DRAWER : "CLOSE_SETTINGS_DRAWER",

  /**
   * The framesheet was reseted and is now probably drastically different.
   * Number of frames, content of frames, color used for the palette may have changed.
   */
  PISKEL_RESET: "PISKEL_RESET",
  PISKEL_SAVE_STATE: "PISKEL_SAVE_STATE",

  PISKEL_SAVED: "PISKEL_SAVED",

  FRAME_SIZE_CHANGED : "FRAME_SIZE_CHANGED",

  SELECTION_CREATED: "SELECTION_CREATED",
  SELECTION_MOVE_REQUEST: "SELECTION_MOVE_REQUEST",
  SELECTION_DISMISSED: "SELECTION_DISMISSED",

  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",

  SHOW_PROGRESS: "SHOW_PROGRESS",
  UPDATE_PROGRESS: "UPDATE_PROGRESS",
  HIDE_PROGRESS: "HIDE_PROGRESS",

  ZOOM_CHANGED : "ZOOM_CHANGED",

  CURRENT_COLORS_UPDATED : "CURRENT_COLORS_UPDATED",

  MOUSE_EVENT : "MOUSE_EVENT",

  // Tests
  TEST_RECORD_END : "TEST_RECORD_END",
  TEST_CASE_END : "TEST_CASE_END",
  TEST_SUITE_END : "TEST_SUITE_END"
};