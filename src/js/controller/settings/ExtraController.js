(function () {
  var ns = $.namespace('pskl.controller.settings');

  ns.ExtraController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.ExtraController.prototype.init = function () {
    this.resizeWidth = $('[name=resize-width]');
    this.resizeHeight = $('[name=resize-height]');

    this.resizeWidth.val(this.piskelController.getWidth());
    this.resizeHeight.val(this.piskelController.getHeight());

    this.cancelButton = $('.resize-cancel-button');
    this.cancelButton.click(this.onCancelButtonClicked_.bind(this));

    this.resizeForm = $("[name=resize-form]");
    this.resizeForm.submit(this.onResizeFormSubmit_.bind(this));

    this.resizeContentCheckbox = $(".resize-content-checkbox");
  };

  ns.ExtraController.prototype.onResizeFormSubmit_ = function (evt) {
    evt.originalEvent.preventDefault();

    var width = parseInt(this.resizeWidth.val(), 10);
    var height = parseInt(this.resizeHeight.val(), 10);

    var resizeContentEnabled = this.isResizeContentEnabled_();
    var resizedLayers = this.piskelController.getLayers().map(this.resizeLayer_.bind(this));

    var piskel = pskl.model.Piskel.fromLayers(resizedLayers, this.piskelController.getPiskel().getDescriptor());

    pskl.app.piskelController.setPiskel(piskel, true);
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };

  ns.ExtraController.prototype.resizeLayer_ = function (layer) {
    var resizedFrames = layer.getFrames().map(this.resizeFrame_.bind(this));
    return pskl.model.Layer.fromFrames(layer.getName(), resizedFrames);
  };

  ns.ExtraController.prototype.resizeFrame_ = function (frame) {
    var width = parseInt(this.resizeWidth.val(), 10);
    var height = parseInt(this.resizeHeight.val(), 10);

    var resizedFrame;
    if (this.isResizeContentEnabled_()) {
      resizedFrame = pskl.utils.FrameUtils.resize(frame, width, height, false);
    } else {
      resizedFrame = new pskl.model.Frame(width, height);
      frame.forEachPixel(function (color, x, y) {
        if (x < resizedFrame.getWidth() && y < resizedFrame.getHeight()) {
          resizedFrame.setPixel(x, y, color);
        }
      });
    }

    return resizedFrame;
  };

  ns.ExtraController.prototype.isResizeContentEnabled_ = function () {
    return !!this.resizeContentCheckbox.prop('checked');
  };

  ns.ExtraController.prototype.onCancelButtonClicked_ = function (evt) {
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };
})();