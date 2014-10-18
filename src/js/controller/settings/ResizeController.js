(function () {
  var ns = $.namespace('pskl.controller.settings');

  ns.ResizeController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.ResizeController.prototype.init = function () {
    this.resizeWidth = $('[name=resize-width]');
    this.resizeHeight = $('[name=resize-height]');

    this.resizeWidth.val(this.piskelController.getWidth());
    this.resizeHeight.val(this.piskelController.getHeight());

    this.cancelButton = $('.resize-cancel-button');
    this.cancelButton.click(this.onCancelButtonClicked_.bind(this));

    this.resizeForm = $("[name=resize-form]");
    this.resizeForm.submit(this.onResizeFormSubmit_.bind(this));

    this.resizeContentCheckbox = $(".resize-content-checkbox");
    
	//ZADDED Added for expand - trim controls
	//
    this.expandLeft = $('[name=expand-left]');
    this.expandRight = $('[name=expand-right]');
    this.expandUp = $('[name=expand-up]');
    this.expandDown = $('[name=expand-down]');
    
    this.expandLeft.val( 0 );
    this.expandRight.val( 0 );
    this.expandUp.val( 0 );
    this.expandDown.val( 0 );
    
    this.expandForm = $("[name=expand-form]");
    this.expandForm.submit(this.onExpandFormSubmit_.bind(this));
    
    this.trimForm = $("[name=trim-form]");
    this.trimForm.submit(this.onTrimFormSubmit_.bind(this));
	//
	//END ZADDED 
    
  };

  ns.ResizeController.prototype.onResizeFormSubmit_ = function (evt) {
    evt.originalEvent.preventDefault();

    var width = parseInt(this.resizeWidth.val(), 10);
    var height = parseInt(this.resizeHeight.val(), 10);

    var resizeContentEnabled = this.isResizeContentEnabled_();
    var resizedLayers = this.piskelController.getLayers().map(this.resizeLayer_.bind(this));

    var piskel = pskl.model.Piskel.fromLayers(resizedLayers, this.piskelController.getPiskel().getDescriptor());

    pskl.app.piskelController.setPiskel(piskel, true);
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };

  ns.ResizeController.prototype.resizeLayer_ = function (layer) {
    var resizedFrames = layer.getFrames().map(this.resizeFrame_.bind(this));
    return pskl.model.Layer.fromFrames(layer.getName(), resizedFrames);
  };

  ns.ResizeController.prototype.resizeFrame_ = function (frame) {
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

  ns.ResizeController.prototype.isResizeContentEnabled_ = function () {
    return !!this.resizeContentCheckbox.prop('checked');
  };

  ns.ResizeController.prototype.onCancelButtonClicked_ = function (evt) {
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };
  
  
	//ZADDED Added for expand - trim controls
	//
	ns.ResizeController.prototype.computeTotalUsedBounds_ = function () {
		
		//Compute TOTAL USED BOUNDS.
		var alllayers = this.piskelController.getLayers();
		var totalbounds = null;
		for( var ix = 0; ix < alllayers.length; ix++ ){
			var clayer = alllayers[ ix ];
			var alframes = clayer.getFrames();
			for( var iy = 0; iy < alframes.length; iy++ ){
				
				//Compute USED bounds in this layer...
				var bounds = pskl.utils.FrameUtils.getBounds( alframes[iy] );
				if( totalbounds != null ){
					if( bounds.xMin < totalbounds.xMin ){ totalbounds.xMin = bounds.xMin; }
					if( bounds.xMax > totalbounds.xMax ){ totalbounds.xMax = bounds.xMax; }
					if( bounds.yMin < totalbounds.yMin ){ totalbounds.yMin = bounds.yMin; }
					if( bounds.yMax > totalbounds.yMax ){ totalbounds.yMax = bounds.yMax; }					
				}else{
					totalbounds = bounds;
				}
			}
		}
		return totalbounds;
	}
  
	ns.ResizeController.prototype.onExpandFormSubmit_ = function (evt) {
		evt.originalEvent.preventDefault();

		var expandPixelsLeft = parseInt(this.expandLeft.val(), 10);
		var expandPixelsRight = parseInt(this.expandRight.val(), 10);
		var expandPixelsUp = parseInt(this.expandUp.val(), 10);
		var expandPixelsDown = parseInt(this.expandDown.val(), 10);
			
		var totalbounds = this.computeTotalUsedBounds_();
		
		//Actually first, we resize all frames accordingly (via normal resize, no scaling (resizeContentEnabled = false))
		//THEN we shift all frames content by the ammounts needed (add left to x, add up to y)
		//Done.
		
		var imagewidth = this.piskelController.getWidth();
		var imageheight = this.piskelController.getHeight();
		var width = imagewidth + expandPixelsLeft + expandPixelsRight;
		var height = imageheight + expandPixelsUp + expandPixelsDown;
		this.resizeWidth.val( width );
		this.resizeHeight.val( height );
		
		//console.log( "heyo..." +totalbounds.xMin + " " + totalbounds.xMax + " " + totalbounds.yMin + " " + totalbounds.yMax );

		//Note this oculd be EASILY improved to include offset in copying back the image into a resize...
		var resizeContentEnabled = 0;
		var alllayers = this.piskelController.getLayers();
		var resizedLayers = alllayers.map(this.resizeLayer_.bind(this));

		//Now to shift all layers (the resized ones that is)
		for( var ix = 0; ix < resizedLayers.length; ix++ ){
			var clayer = resizedLayers[ ix ];
			var alframes = clayer.getFrames();
			for( var iy = 0; iy < alframes.length; iy++ ){
				alframes[ iy ].shift( expandPixelsLeft, expandPixelsUp );
			}
		}
		
		var piskel = pskl.model.Piskel.fromLayers(resizedLayers, this.piskelController.getPiskel().getDescriptor());

		pskl.app.piskelController.setPiskel(piskel, true);
		$.publish(Events.CLOSE_SETTINGS_DRAWER);
	}
    
	ns.ResizeController.prototype.onTrimFormSubmit_ = function (evt) {
		evt.originalEvent.preventDefault();

		//Trim first computes the TOTAL bounding box for all frames.
		//Then, shifts all frames by that amount so the image date is in the upper left corner.
		//THEN we call resize, no scaling (resizeContentEnabled = false))
		
		var expandPixelsLeft = parseInt(this.expandLeft.val(), 10);
		var expandPixelsRight = parseInt(this.expandRight.val(), 10);
		var expandPixelsUp = parseInt(this.expandUp.val(), 10);
		var expandPixelsDown = parseInt(this.expandDown.val(), 10);
			
		var totalbounds = this.computeTotalUsedBounds_();
		
		//Actually first, we resize all frames accordingly (via normal resize, no scaling (resizeContentEnabled = false))
		//THEN we shift all frames content by the ammounts needed (add left to x, add up to y)
		//Done.
		
		var imagewidth = this.piskelController.getWidth();
		var imageheight = this.piskelController.getHeight();
		
		//console.log( "trim..." +totalbounds.xMin + " " + totalbounds.xMax + " " + totalbounds.yMin + " " + totalbounds.yMax );
		
		//Now to shift all layers (the resized ones that is)
		var alllayers = this.piskelController.getLayers();
		for( var ix = 0; ix < alllayers.length; ix++ ){
			var clayer = alllayers[ ix ];
			var alframes = clayer.getFrames();
			for( var iy = 0; iy < alframes.length; iy++ ){
				alframes[ iy ].shift( -totalbounds.xMin, -totalbounds.yMin );
			}
		}
		
		//Note this oculd be EASILY improved to include offset in copying back the image into a resize...
		var width = 1 + (totalbounds.xMax - totalbounds.xMin);
		var height = 1 + (totalbounds.yMax - totalbounds.yMin);
		this.resizeWidth.val( width );
		this.resizeHeight.val( height );
		
		var resizeContentEnabled = 0;
		var resizedLayers = alllayers.map(this.resizeLayer_.bind(this));

		var piskel = pskl.model.Piskel.fromLayers(resizedLayers, this.piskelController.getPiskel().getDescriptor());

		pskl.app.piskelController.setPiskel(piskel, true);
		$.publish(Events.CLOSE_SETTINGS_DRAWER);
	}
	//
	//END ZADDED 
  
})();