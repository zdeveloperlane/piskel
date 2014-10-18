/**
 * @provide pskl.drawingtools.BaseTool
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.drawingtools");

  ns.BaseTool = function() {
    this.toolId = "tool-base";
  };

  ns.BaseTool.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {};

  ns.BaseTool.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {};

  ns.BaseTool.prototype.replay = Constants.ABSTRACT_FUNCTION;

  ns.BaseTool.prototype.moveUnactiveToolAt = function(col, row, color, frame, overlay, event) {

    if (overlay.containsPixel(col, row)) {
      if (!isNaN(this.highlightedPixelCol) &&
        !isNaN(this.highlightedPixelRow) &&
        (this.highlightedPixelRow != row ||
          this.highlightedPixelCol != col)) {

        // Clean the previously highlighted pixel:
        overlay.clear();
      }

      // Show the current pixel targeted by the tool:
      overlay.setPixel(col, row, Constants.TOOL_TARGET_HIGHLIGHT_COLOR);

      this.highlightedPixelCol = col;
      this.highlightedPixelRow = row;
    } else {
      this.hideHighlightedPixel(overlay);
    }
  };

  ns.BaseTool.prototype.hideHighlightedPixel = function(overlay) {
    if (this.highlightedPixelRow !== null && this.highlightedPixelCol !== null) {
      try {
        overlay.setPixel(this.highlightedPixelCol, this.highlightedPixelRow, Constants.TRANSPARENT_COLOR);
      } catch (e) {
        window.console.warn('ns.BaseTool.prototype.hideHighlightedPixel failed');
      }
      this.highlightedPixelRow = null;
      this.highlightedPixelCol = null;
    }
  };
  
  ns.BaseTool.prototype.raiseSaveStateEvent = function (replayData) {
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.REPLAY,
      scope : this,
      replay : replayData
    });
  };

  ns.BaseTool.prototype.getHelpText = function() {
    return this.shortHelpText || this.helpText;
  };

  ns.BaseTool.prototype.getTooltipText = function(shortcut) {
    var tpl = pskl.utils.Template.get('drawing-tool-tooltip-container-template');

    var descriptors = "";
    if (Array.isArray(this.tooltipDescriptors)) {
      this.tooltipDescriptors.forEach(function (descriptor) {
        descriptors += this.getTooltipDescription(descriptor);
      }.bind(this));
    }

    return pskl.utils.Template.replace(tpl, {
      helptext : this.getHelpText(),
      shortcut : shortcut,
      descriptors : descriptors
    });
  };

  ns.BaseTool.prototype.getTooltipDescription = function(descriptor) {
    var tpl;
    if (descriptor.key) {
      tpl = pskl.utils.Template.get('drawing-tool-tooltip-descriptor-template');
      descriptor.key = descriptor.key.toUpperCase();
      if (pskl.utils.UserAgent.isMac) {
        descriptor.key = descriptor.key.replace('CTRL', 'CMD');
      }
    } else {
      tpl = pskl.utils.Template.get('drawing-tool-tooltip-descriptor-simple-template');
    }
    return pskl.utils.Template.replace(tpl, descriptor);
  };

  ns.BaseTool.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {};

  /**
   * Bresenham line algorithm: Get an array of pixels from
   * start and end coordinates.
   *
   * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
   * http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
   *
   * @private
   */
  ns.BaseTool.prototype.getLinePixels_ = function(x0, x1, y0, y1) {
    x1 = pskl.utils.normalize(x1, 0);
    y1 = pskl.utils.normalize(y1, 0);

    var pixels = [];
    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;
    while(true){

      // Do what you need to for this
      pixels.push({"col": x0, "row": y0});

      if ((x0==x1) && (y0==y1)) {
        break;
      }

      var e2 = 2*err;
      if (e2>-dy){
        err -= dy;
        x0  += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0  += sy;
      }
    }
    return pixels;
  };
})();
