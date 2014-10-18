/**
 * @provide pskl.drawingtools.ShiftTool
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.drawingtools");

  ns.ShiftTool = function() {
    this.toolId = "tool-shift";
    this.helpText = "Shift Tool - Draw a vertical or horizontal line to shift those rows of pixels";

    this.tooltipDescriptors = [
      {key : 'shift', description : 'Use rotate instead of shift'}
    ];
    
    this.firstPointX = -1;
    this.firstPointY = -1;
    this.currentPointX = -1;
    this.currentPointY = -1;
    this.tolerantRadius = 3.5;
    this.decidedAxis = 0;
    this.shiftMap = {};
    this.methodUsed = 0;
    
    this.pixels = [];	//changed actual pixels...
  };

  pskl.utils.inherit(ns.ShiftTool, ns.BaseTool);

  //ns.BaseTool.prototype.moveUnactiveToolAt = function(col, row, color, frame, overlay, event) {

	//Do nothing? unactive tool? who CARES.
	//console.log( "Shift tool - moveUnactiveToolAt" );
  //};

  ns.BaseTool.prototype.hideHighlightedPixel = function(overlay) {
    
	//? Ignore.
	//console.log( "Shift tool - hideHighlightedPixel" );
  };
  
  /**
   * @override
   */
  ns.ShiftTool.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
	
	//Happens when the tool FIRST starts.
	this.firstPointX = col;
	this.firstPointY = row;
    this.currentPointX = col;
    this.currentPointY = row;
    
    this.decidedAxis = 0;
    
	//Need to "touch" the overlay...
	overlay.setPixel( col, row, '#ff00ff' ); 
	//overlay.fromPixelGrid( frame.getPixels() );
	//console.log( overlay.getPixel( 0, 0 ) );
	//console.log( frame.getPixel( 0, 0 ) );
	
    //IE copy frame -> overlay
	// 
	frame.forEachPixel( 
		function( pvalue, x, y, fam ){ 
	//		overlay.setPixel( x, y, Constants.TRANSPARENT_COLOR ); 
			overlay.setPixel( x, y, pvalue ); 
		}
	);
	
	//overlay.setPixel( col, row, Constants.TRANSPARENT_COLOR );//'#ff00ff' ); 
	
    
  };

  /**
   * @override
   */
  ns.ShiftTool.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
	
	//Happens DURING the drag operation
    this.currentPointX = col;
    this.currentPointY = row;
    
    //Compute tool delta
    overlay.setPixel( col, row, Constants.TRANSPARENT_COLOR );
    
    var dx = (this.currentPointX - this.firstPointX);
    var dy = (this.currentPointY - this.firstPointY);
    var dm = ( dx*dx + dy*dy );
	if( this.decidedAxis == 0 ){
		if( dm > this.tolerantRadius ){
					
			//IE copy frame -> overlay BEFORE shifting...
			// 
			//frame.forEachPixel( 
			//	function( pvalue, x, y, fam ){ 
			//		overlay.setPixel( x, y, pvalue ); 
			//	}
			//);
	
			if( Math.abs( dx ) > Math.abs( dy ) ){
				
				if( dx > 0 ){
					this.decidedAxis = 1; //x
					overlay.shiftX( row, 1 );
				}else{
					this.decidedAxis = -1; //x
					overlay.shiftX( row, -1 );
				}
				
			}else{
				
				if( dy > 0 ){
					this.decidedAxis = 2; //y
					overlay.shiftY( col, 1 );
				}else{
					this.decidedAxis = -2; //y
					overlay.shiftY( col, -1 );
				}
			}
			
			this.methodUsed = event.shiftKey;	//0 or 1. Only ONE CHANCE per tool use to set this.
			
			
		}
		
		//Set cursor to? arrows?
    }else{
		if( dm < this.tolerantRadius ){
			//Ignore?
			//this.decidedAxis = 0;
		}else{
			
			if( this.methodUsed ){
				
				
			}else{
			
				//Compute row shift...
				
				//IE copy frame -> overlay
				//frame.forEachPixel( function( pvalue, x, y, fam){ overlay.setPixel( x, y, pvalue ); } );
				
				//Shift rows accordingly...
			
				//this.shiftMap = {};
		
				//Set cursor to x or y arrow?
			}
		}
    }
    
    //overlay.drawLine( );
   
  };


  ns.ShiftTool.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
	
    // apply on real frame (compute changed rows, and load/store pixel changes as needed)
    //	IE, any operation IS just an array of pixels to get/set as a save state.
    
    
    this.setPixelsToFrame_(frame, this.pixels);

    // save state
    this.raiseSaveStateEvent({
      pixels : this.pixels.slice(0),
      color : color
    });
    
    //Reset
	pixels = [];

	overlay.clear();	//INEFFICIENT? ... fixes the overlay glitch so far
	
	console.log( "Shift tool - releaseToolAt" );
  };

  ns.ShiftTool.prototype.replay = function (frame, replayData) {
	
    this.setPixelsToFrame_(frame, replayData.pixels, replayData.color);
    
  };

  ns.ShiftTool.prototype.setPixelsToFrame_ = function (frame, pixels, color) {
	
    pixels.forEach(function (pixel) {
      frame.setPixel(pixel.col, pixel.row, pixel.color);
    });
    
  };

})();
