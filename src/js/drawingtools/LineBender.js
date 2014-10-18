/**
 * @provide pskl.drawingtools.LineBender
 *
 */
(function() {
  var ns = $.namespace("pskl.drawingtools");

  ns.LineBender = function() {
    this.toolId = "tool-linebender";

    this.helpText = "Distort a range of line areas";

    this.tooltipDescriptors = [
      //{key : 'ctrl', description : 'Apply to all layers'},
      {key : 'shift', description : 'Straighten segment'}
    ];
  };

  pskl.utils.inherit(ns.LineBender, ns.BaseTool);

  /**
   * @override
   */
  ns.LineBender.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    if (frame.containsPixel(col, row)) {
      
	  /*var sampledColor = frame.getPixel(col, row);

      var allLayers = pskl.utils.UserAgent.isMac ?  event.metaKey : event.ctrlKey;
      var allFrames = event.shiftKey;

      this.swapColors(sampledColor, color, allLayers, allFrames);

      $.publish(Events.PISKEL_SAVE_STATE, {
        type : pskl.service.HistoryService.SNAPSHOT
      });
      */
    }
  };

  ns.LineBender.prototype.swapColors = function(oldColor, newColor, allLayers, allFrames) {
    
	/*var swapPixelColor = function (pixelColor,x,y,frame) {
      if (pixelColor == oldColor) {
        frame.pixels[x][y] = newColor;
      }
    };
    var currentLayer = pskl.app.piskelController.getCurrentLayer();
    var currentFrameIndex = pskl.app.piskelController.getCurrentFrameIndex();
    pskl.app.piskelController.getPiskel().getLayers().forEach(function (l) {
      if (allLayers || l === currentLayer) {
        l.getFrames().forEach(function (f, frameIndex) {
          if (allFrames || frameIndex === currentFrameIndex) {
            f.forEachPixel(swapPixelColor);
            f.version++;
          }
        });
      }
    });
    */
  };
})();
