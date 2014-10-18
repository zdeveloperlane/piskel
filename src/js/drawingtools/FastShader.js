/**
 * @provide pskl.drawingtools.FastShader
 *
 */
(function() {
  var ns = $.namespace("pskl.drawingtools");

  ns.FastShader = function() {
    this.toolId = "tool-fastshader";

    this.helpText = "From first color, the connected range of colors is selected, and you can can shade that region only";

    this.tooltipDescriptors = [
      //{key : 'ctrl', description : 'Apply to all layers'},
      {key : 'shift', description : 'Lighten'}
    ];
  };

  pskl.utils.inherit(ns.FastShader, ns.BaseTool);

  /**
   * @override
   */
  ns.FastShader.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
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

  ns.FastShader.prototype.swapColors = function(oldColor, newColor, allLayers, allFrames) {
    
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
