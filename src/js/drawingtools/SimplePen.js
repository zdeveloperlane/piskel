/**
 * @provide pskl.drawingtools.SimplePen
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.drawingtools");

  ns.SimplePen = function() {
    this.toolId = "tool-pen";
    this.helpText = "Pen tool";

    this.tooltipDescriptors = [
      {key : 'shift', description : 'Paint only pixels of first clicked color'}
    ];
    
    this.previousCol = null;
    this.previousRow = null;
    
    this.firstColorOnly = null;
    
    this.toolrangeminx = 0;
    this.toolrangeminy = 0;
    this.toolrangemaxx = -1;
    this.toolrangemaxy = -1;
    
    this.pixels = [];
  };

  pskl.utils.inherit(ns.SimplePen, ns.BaseTool);

  ns.BaseTool.prototype.moveUnactiveToolAt = function(col, row, color, frame, overlay, event) {

	
	//Clear OLD highlight range:
	for( var ix=this.toolrangeminx; ix <= this.toolrangemaxx; ix++ ) {
		for( var iy=this.toolrangeminy; iy <= this.toolrangemaxy; iy++ ) {
			overlay.setPixel(ix, iy, Constants.TRANSPARENT_COLOR);
		}
	}
	this.toolrangeminx = 0;
	this.toolrangemaxx = -1;
	this.toolrangeminy = 0;
	this.toolrangemaxy = -1;
	
    //BRUSH SIZE ? Absolute. Need to abstract this... utils?
    //getExtents( col, row, xsize, ysize );
    //Where 1 is the minimum size... 0 and less does the same as 1.
    var xwidth = pskl.UserSettings.get(pskl.UserSettings.DRAW_PEN_XSIZE);
    var yheight = pskl.UserSettings.get(pskl.UserSettings.DRAW_PEN_YSIZE);
    var minx = Math.floor( xwidth/2 );
    var miny = Math.floor( yheight/2 );
    var maxx = xwidth;
    var maxy = yheight;
    //min = ( col-minx, row-miny )
    //max = ( col-minx+maxx, row-miny+maxy )
    
    this.toolrangeminx = col-minx;
    this.toolrangeminy = row-miny;
    this.toolrangemaxx = col-minx+maxx;
    this.toolrangemaxy = row-miny+maxy;
    
    //overlay.clear();	//INEFFICIENT?
    
    //DRAW NEW RANGE
	for( var ix=this.toolrangeminx; ix <= this.toolrangemaxx; ix++ ) {
		for( var iy=this.toolrangeminy; iy <= this.toolrangemaxy; iy++ ) {
			overlay.setPixel(ix, iy, Constants.TOOL_TARGET_HIGHLIGHT_COLOR);
		}
	}
        
        
    /*
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
    */
    
  };

  ns.BaseTool.prototype.hideHighlightedPixel = function(overlay) {
    
	//Clear OLD highlight range:
	for( var ix=this.toolrangeminx; ix <= this.toolrangemaxx; ix++ ) {
		for( var iy=this.toolrangeminy; iy <= this.toolrangemaxy; iy++ ) {
			overlay.setPixel(ix, iy, Constants.TRANSPARENT_COLOR);
		}
	}
	this.toolrangeminx = 0;
	this.toolrangemaxx = -1;
	this.toolrangeminy = 0;
	this.toolrangemaxy = -1;
    
	/*
	if (this.highlightedPixelRow !== null && this.highlightedPixelCol !== null) {
      try {
        overlay.setPixel(this.highlightedPixelCol, this.highlightedPixelRow, Constants.TRANSPARENT_COLOR);
      } catch (e) {
        window.console.warn('ns.BaseTool.prototype.hideHighlightedPixel failed');
      }
      this.highlightedPixelRow = null;
      this.highlightedPixelCol = null;
    }
    */
    
  };
  
  /**
   * @override
   */
  ns.SimplePen.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
	
    this.previousCol = col;
    this.previousRow = row;
    
    var usefirstcolor = event.shiftKey;
    
    if( usefirstcolor ){
		if( this.firstColorOnly == null ){
			this.firstColorOnly = frame.getPixel(col, row);
		}
    }
    
    //BRUSH SIZE ? Absolute. Need to abstract this... utils?
    //getExtents( col, row, xsize, ysize );
    //Where 1 is the minimum size... 0 and less does the same as 1.
    var xwidth = pskl.UserSettings.get(pskl.UserSettings.DRAW_PEN_XSIZE);
    var yheight = pskl.UserSettings.get(pskl.UserSettings.DRAW_PEN_YSIZE);
    var minx = Math.floor( xwidth/2 );
    var miny = Math.floor( yheight/2 );
    var maxx = xwidth;
    var maxy = yheight;
    //min = ( col-minx, row-miny )
    //max = ( col-minx+maxx, row-miny+maxy )
    
    this.toolrangeminx = col-minx;
    this.toolrangeminy = row-miny;
    this.toolrangemaxx = col-minx+maxx;
    this.toolrangemaxy = row-miny+maxy;
    
	for( var ix=col-minx; ix <= col-minx+maxx; ix++ ) {
		for( var iy=row-miny; iy <= row-miny+maxy; iy++ ) {
				
			mycolor = frame.getPixel(ix, iy);
				
			var doit = (mycolor != color);
			
			if( doit ){	//Don't repeat already identical color!
				
				if( usefirstcolor ){
					doit = false;
					if( mycolor == this.firstColorOnly ){
						doit = true;
					}
				}
				
				if( doit ){
					
					overlay.setPixel(ix, iy, color);

					//if (color === Constants.TRANSPARENT_COLOR) {
					//Eraser version?
					if (color == Constants.TRANSPARENT_COLOR) {
						frame.setPixel(ix, iy, color);
					}

					//Beware of duplicates?? hm... bleh.
					this.pixels.push({
						col : ix,
						row : iy,
						color : color
					});
				}
			}
		}
	}

  };

  /**
   * @override
   */
  ns.SimplePen.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
	
	
    if((Math.abs(col - this.previousCol) > 1) || (Math.abs(row - this.previousRow) > 1)) {
      // The pen movement is too fast for the mousemove frequency, there is a gap between the
      // current point and the previously drawn one.
      // We fill the gap by calculating missing dots (simple linear interpolation) and draw them.
      var interpolatedPixels = this.getLinePixels_(col, this.previousCol, row, this.previousRow);
      for(var i=0, l=interpolatedPixels.length; i<l; i++) {
        var coords = interpolatedPixels[i];
        //Perfectly OK!
        this.applyToolAt(coords.col, coords.row, color, frame, overlay, event);
      }
    }
    else {
      //Perfectly OK!
      this.applyToolAt(col, row, color, frame, overlay, event);
    }

    this.previousCol = col;
    this.previousRow = row;
  };


  ns.SimplePen.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
	
	
    // apply on real frame
    this.setPixelsToFrame_(frame, this.pixels);

    // save state
    this.raiseSaveStateEvent({
      pixels : this.pixels.slice(0),
      color : color
    });

    // reset
    this.resetUsedPixels_();
    
	overlay.clear();	//INEFFICIENT? ... fixes the overlay glitch so far
	
    this.firstColorOnly = null;
    this.previousCol = null;
    this.previousRow = null;
  };

  ns.SimplePen.prototype.replay = function (frame, replayData) {
	
    this.setPixelsToFrame_(frame, replayData.pixels, replayData.color);
    
  };

  ns.SimplePen.prototype.setPixelsToFrame_ = function (frame, pixels, color) {
	
    pixels.forEach(function (pixel) {
      frame.setPixel(pixel.col, pixel.row, pixel.color);
    });
    
  };

  ns.SimplePen.prototype.resetUsedPixels_ = function() {
	
    this.pixels = [];
    
  };
})();
