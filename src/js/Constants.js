// TODO(grosbouddha): put under pskl namespace.
var Constants = {
  DEFAULT : {
    HEIGHT : 32,
    WIDTH : 32,
    FPS : 12
  },

  MODEL_VERSION : 2,

  MAX_HEIGHT : 1024,
  MAX_WIDTH : 1024,

  MAX_CURRENT_COLORS_DISPLAYED : 100,

  MINIMUM_ZOOM : 1,

  PREVIEW_FILM_SIZE : 96,
  ANIMATED_PREVIEW_WIDTH : 200,

  DEFAULT_PEN_COLOR : '#000000',
  TRANSPARENT_COLOR : 'rgba(0, 0, 0, 0)',

  OVERLAY_ONION_SKIN : 'onion-skin',
  OVERLAY_LAYER_PREVIEW : 'layer-preview',
  OVERLAY_DISABLED : 'no-overlay',

  NO_PALETTE_ID : '__no-palette',
  CURRENT_COLORS_PALETTE_ID : '__current-colors',

  // Used for Spectrum input
  PREFERRED_COLOR_FORMAT : 'rgb',

  /*
   * Fake semi-transparent color used to highlight transparent
   * strokes and rectangles:
   */
  SELECTION_TRANSPARENT_COLOR: 'rgba(255, 255, 255, 0.6)',

  /*
   * When a tool is hovering the drawing canvas, we highlight the eventual
   * pixel target with this color:
   */
  TOOL_TARGET_HIGHLIGHT_COLOR: 'rgba(255, 255, 255, 0.2)',

  /*
   * Default entry point for piskel web service:
   */
  STATIC : {
    URL : {
      SAVE : 'http://3.piskel-app.appspot.com/store',
      GET : 'http://3.piskel-app.appspot.com/get'
    }
  },
  APPENGINE : {
    URL : {
      SAVE : 'save'
    }
  },
  IMAGE_SERVICE_UPLOAD_URL : 'http://localhost:12080/__/upload',
  IMAGE_SERVICE_GET_URL : 'http://localhost:12080/img/',

  ZOOMED_OUT_BACKGROUND_COLOR : '#A0A0A0',

  LEFT_BUTTON : 0,
  MIDDLE_BUTTON : 1,
  RIGHT_BUTTON : 2,
  MOUSEMOVE_THROTTLING : 10,

  ABSTRACT_FUNCTION : function () {throw 'abstract method should be implemented';},
  EMPTY_FUNCTION : function () {},

  // TESTS
  DRAWING_TEST_FOLDER : 'drawing'
};