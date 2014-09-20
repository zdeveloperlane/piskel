(function () {
  var ns = $.namespace('pskl.worker');

  var worker = function () {

    var postStep_ = function (step, total) {
      this.postMessage({
        type : 'STEP',
        step : step,
        total : total
      });
    };

    var imageDataToGrid = function (imageData, width, height, transparent) {
      // Draw the zoomed-up pixels to a different canvas context
      var grid = [];
      for (var x = 0 ; x < width ; x++){
        grid[x] = [];
        postStep_(x, (width-1)*2);
        for (var y = 0 ; y < height ; y++){
          // Find the starting index in the one-dimensional image data
          var i = (y * width + x)*4;
          var r = imageData[i  ];
          var g = imageData[i+1];
          var b = imageData[i+2];
          var a = imageData[i+3];
          if (a < 125) {
            grid[x][y] = transparent;
          } else {
            grid[x][y] = pskl.utils.FrameUtils.rgbToHex(r,g,b);
          }
        }
      }
      return grid;
    };

    var getColorsMapFromImageData = function (imageData, width, height) {
      var grid = imageDataToGrid(imageData, width, height, 'transparent');

      var colorsMap = {};
      for (var i = 0 ; i < grid.length ; i++) {
        var step = (grid.length-1) + i;
        var total = (grid.length-1)*2;
        postStep_(step, total);
        for (var j = 0 ; j < grid[i].length ; j++) {
          var color = grid[i][j];
          if (color != 'transparent') {
            colorsMap[color] = true;
          }
        }
      }
      return colorsMap;
    };

    this.onmessage = function(event) {
      var data = event.data;
      if (data.type === 'RUN_SCRIPT') {
        this.importScripts(data.script);
      } else {
        try {
          var colorsMap = getColorsMapFromImageData(data.imageData, data.width, data.height);
          this.postMessage({
            type : 'SUCCESS',
            colorsMap : colorsMap
          });
        } catch(e) {
          this.postMessage({
            type : 'ERROR',
            message : e.message
          });
        }
      }
    };
  };

  try {
    // create worker from blob
    var typedArray = [(worker+"").replace(/function \(\) \{/,"").replace(/\}[^}]*$/, "")];
    var blob = new Blob(typedArray, {type: "application/javascript"}); // pass a useful mime type here
    var blobUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    console.error("Could not create worker", e.message);
  }

  ns.ImageProcessor = function (image, onSuccess, onStep, onError) {
    this.image = image;

    this.onStep = onStep;
    this.onSuccess = onSuccess;
    this.onError = onError;

    this.worker = new Worker(blobUrl);
    this.worker.onmessage = this.onWorkerMessage.bind(this);
  };

  ns.ImageProcessor.prototype.process = function () {
    this.importAll(pskl.utils.FrameUtils, 'pskl.utils.FrameUtils');
    this.importAll(pskl.utils.CanvasUtils, 'pskl.utils.CanvasUtils');

    var imageData = pskl.utils.FrameUtils.imageToImageData(this.image);
    this.worker.postMessage({
      imageData : imageData,
      width : this.image.width,
      height : this.image.height
    });
  };

  ns.ImageProcessor.prototype.createNamespace = function (name) {
    var createNamespace = (function () {
      var parts = name.split('.');
      if (parts.length > 0) {
        var node = this;
        for (var i = 0 ; i < parts.length ; i++) {
          if (!node[parts[i]]) {
            node[parts[i]] = {};
          }
          node = node[parts[i]];
        }
      }
    });
    var script = createNamespace + "";
    script = script.replace(/function \(\) \{/,"").replace(/\}[^}]*$/, "");
    script = "var name = '" + name + "';" + script;

    this.runScript(script);
  };

  ns.ImageProcessor.prototype.importAll = function (classToImport, classpath) {
    this.createNamespace('pskl.utils.FrameUtils');
    for (var key in classToImport) {
      if (classToImport.hasOwnProperty(key)) {
        this.addMethod(classToImport[key], classpath + '.' + key);
      }
    }
  };

  ns.ImageProcessor.prototype.addMethod = function (method, name) {
    this.runScript(name  + "=" + method);
  };

  ns.ImageProcessor.prototype.runScript = function (script) {
    this.worker.postMessage({
      type : 'RUN_SCRIPT',
      script : this.getScriptAsUrl(script)
    });
  };

  ns.ImageProcessor.prototype.getScriptAsUrl = function (script) {
    var blob = new Blob([script], {type: "application/javascript"}); // pass a useful mime type here
    return window.URL.createObjectURL(blob);
  };

  ns.ImageProcessor.prototype.onWorkerMessage = function (event) {
    if (event.data.type === 'STEP') {
      this.onStep(event);
    } else if (event.data.type === 'SUCCESS') {
      this.onSuccess(event);
      this.worker.terminate();
    } else if (event.data.type === 'ERROR') {
      this.onError(event);
      this.worker.terminate();
    }
  };
})();


