// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/states/GameState.js":[function(require,module,exports) {
"use strict"; // let's capture all errors
//this game will have only 1 state

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  //executed after everything is loaded
  create: function create() {
    // Let's set a number of constants, so they can be changed later
    this.NUM_ROWS = 13;
    this.NUM_COLS = 13;
    this.NUM_CIRCLES = 13;
    this.BLOCK_SIZE = 20;
    this.SCALE_CIRCLE = this.BLOCK_SIZE / 85 * 0.6;
    this.GRID_WIDTH = 1;
    this.GRID_START_X = 40;
    this.GRID_START_Y = 40;
    this.GRID_END_X = this.NUM_COLS * this.BLOCK_SIZE;
    this.GRID_END_Y = this.NUM_ROWS * this.BLOCK_SIZE; // create a Rectangle frame around grid (invisible)

    this.frame = new Phaser.Rectangle(this.GRID_START_X, this.GRID_START_Y, this.GRID_END_X, this.GRID_END_Y); // Array for rectangles in grid

    this.rect = []; // matrix for grid, initialise with zeroes

    this.gridMatrix = [];

    for (var i = 0; i < this.NUM_COLS; i++) {
      // create an array per column
      this.gridMatrix.push([]);

      for (var j = 0; j < this.NUM_ROWS; j++) {
        this.gridMatrix[i].push(0); // fill each column with zeroes
      }
    } // initialise circle counter


    this.circlesLeft = this.NUM_CIRCLES;
    var style = {
      font: '15px Arial',
      fill: '#000'
    };
    this.game.add.text(350, 40, 'Drag all the circles from the centre\nand place them anywhere on the grid. ', style);
    this.game.add.text(350, 100, 'Circles left: ', style);
    style = {
      font: '25px Arial',
      fill: '#0d50bc'
    };
    this.circleScore = this.game.add.text(450, 95, '', style);
    this.refreshStats(0); // draw the grid

    this.drawGrid(); // draw the circles

    this.drawCircles(); // debugging

    this.result = '';
  },
  update: function update() {//      this.refreshStats(0);
  },
  // draw grid
  drawGrid: function drawGrid() {
    this.grid = game.add.graphics(this.GRID_START_X, this.GRID_START_Y);
    this.grid.lineStyle(this.GRID_WIDTH, '#000', 1); //       this.grid.boundsPadding = 0; // from default of 10

    /* draw the grid with graphics, Rows * Cols number of rectangles
    also create invisible rectangles of the same size on top of each (for snap to grid)
    */

    for (var i = 0; i < this.NUM_COLS; i++) {
      for (var j = 0; j < this.NUM_ROWS; j++) {
        this.grid.drawRect(i * this.BLOCK_SIZE, j * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
        this.rect.push(new Phaser.Rectangle(this.GRID_START_X + i * this.BLOCK_SIZE, this.GRID_START_Y + j * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE));
      }
    }

    this.grid.generateTexture(); // change graphics into texture to increase performance
  },
  drawCircles: function drawCircles() {
    // draw circles in the centre of the grid, first move graphics pointer to the centre
    this.circles = game.add.group(); // group for all circles

    this.circles.enableBody = true;

    for (var i = 0; i < this.NUM_CIRCLES; i++) {
      this.circle = this.circles.create(this.frame.centerX, this.frame.centerY, 'circle');
      this.circle.inputEnabled = true; //circle.pixelPerfectClick = true;

      this.circle.input.enableDrag(true, true, true, '255', this.frame);
      this.circle.anchor.setTo(0.5);
      this.circle.scale.setTo(this.SCALE_CIRCLE);
      this.circle.body.collideWorldBounds = true;
      this.circle.moved = false;
      this.circle.events.onDragStart.add(this.onDragStart, this);
      this.circle.events.onDragStop.add(this.onDragStop, this);
    }
  },
  onDragStart: function onDragStart(sprite) {
    console.log(this.circle.input.pointerDragged());
    sprite.frame = 2; // make circle grey whilst being dragged
    //        if (this.justAClick(sprite)) {return;} // if the user just clicked (no drag), do nothing
    // check if this is the initial move or subsequent move for circle

    if (sprite.moved) {
      // already moved. Capture current coordinates in a temp variable, tempCoord.
      this.tempXY = {
        x: sprite.x,
        y: sprite.y
      };
      this.tempCoord = this.getCoord(sprite); // debug
      //            console.log('already moved, on an occupied box ' + this.tempCoord.x + this.tempCoord.y + 'gridMatrix is ' + this.gridMatrix[this.tempCoord.y][this.tempCoord.x]);
      // reset the status in the grid to zero

      this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 0; // x is column, y is row
      // console.log('gridMatrix set to zero ' + this.gridMatrix[this.tempCoord.y][this.tempCoord.x]);

      return; // exit
    } else if (!sprite.moved) {// moved == false, Therefore it is the initial movement
      //           console.log('initial move');
      //           sprite.moved = true; // first move done
      // change sprite colour in spritesheet
    } else {
      throw new Error(console.log('something went wrong, ' + sprite.frame));
    } // debug


    this.result = 'dragging ' + sprite.key;
  },
  onDragStop: function onDragStop(sprite) {
    console.log(this.circle.input.pointerDragged());
    console.log('dragStop event...');
    /*
    // First, we check for overlap with the whole grid frame and reset circle if out of bounds
    if (!Phaser.Rectangle.intersects(sprite.getBounds(), this.frame)) {
    		this.resetCircle(sprite);
    		console.log('out of bounds, resetting circle');
    		return; // exit
    }
    */
    // Second, we find the coordinates of the current location (within the frame)

    var coord = this.getCoord(sprite); // debug

    console.log(coord);
    this.seeGrid(); // Third, we check if this is the location is occupied

    this.occupied = this.gridMatrix[coord.y][coord.x] === 1;

    if (!this.occupied && !sprite.moved) {
      // Not occupied AND initial movement, therefore occupy location
      this.gridMatrix[coord.y][coord.x] = 1; // occupy location

      sprite.moved = true; // mark circle as moved

      this.refreshStats(-1); // reduce counter as this is initial movement of circle

      this.snapToGrid(sprite); // snap to grid

      sprite.frame = 1; // change to blue colour, resting state

      console.log('Not OCC - 1st Move');
    } else if (!this.occupied && sprite.moved) {
      // Not occupied AND subsequent move (new location OR just up and down movement, i.e. same location)
      // Clear previous location first (IMPORTANT, if up and down movement)
      this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 0; //reset old location

      this.gridMatrix[coord.y][coord.x] = 1; // occupy location (either same or new)

      this.snapToGrid(sprite);
      sprite.frame = 1; // change to blue colour, resting state

      console.log('Not OCC - later Move');
    } else if (this.occupied && !sprite.moved) {
      // Occupied AND this is the initial movement of this circle
      // reset circle
      this.resetCircle(sprite);
      console.log(' OCC - 1st Move');
    } else if (this.occupied && sprite.moved) {
      // Occupied AND circle is being moved from previous location
      // move circle back to previous location and occupy it on the grid
      sprite.x = this.tempXY.x;
      sprite.y = this.tempXY.y;
      this.snapToGrid(sprite);
      this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 1; // occupy location (either same or new)

      sprite.frame = 1; // change to blue colour, resting state

      console.log(' OCC - later Move');
    }

    this.seeGrid(); // let's check the grid now

    /* check if there is already a circle on those coordinates
    if (this.gridMatrix[coord.y][coord.x] === 1 ) { //x is column, y is row
    		this.resetCircle(sprite);
    		this.seeGrid();
    		return;
    } else if (sprite.moved) { // check if this is the initial move, if not, don't change counter
    		// mark location of the circle in the grid matrix
    		this.gridMatrix[coord.y][coord.x] = 1;
    		this.seeGrid();
    } else {
    		// initial move to an empty place - mark location of the circle in the grid matrix
    		sprite.moved = true; // first move done
    		this.gridMatrix[coord.y][coord.x] = 1;
    		this.seeGrid();
    		this.refreshStats(1);
    */

    this.result = 'dropped ' + sprite.key + sprite.position;
    this.result = sprite.key + " dropped at x:" + sprite.x + " y: " + sprite.y;
  },
  getCoord: function getCoord(sprite) {
    // find the coordinates of the sprite, as we now know the coordinates are within the frame
    var getCoord = {
      x: 0,
      y: 0
    };
    getCoord.x = Math.floor((sprite.position.x - this.GRID_START_X) / this.BLOCK_SIZE);
    getCoord.y = Math.floor((sprite.position.y - this.GRID_START_Y) / this.BLOCK_SIZE);
    console.log(getCoord.x + ', ' + getCoord.y);
    return getCoord;
    /*
    				// find the coordinates of the sprite, as we now know the coordinates are within the frame
    				var coord = {x: 0, y: 0};
    				console.log(sprite.x + ', ' + sprite.y);
    				coord.x = (sprite.position.x - (sprite.position.x % this.BLOCK_SIZE)) / this.BLOCK_SIZE - 1; // minus 1, as 0-7
    				coord.y = (sprite.position.y - (sprite.position.y % this.BLOCK_SIZE)) / this.BLOCK_SIZE - 1;
    				return coord;
    */
  },
  resetCircle: function resetCircle(sprite) {
    // move sprite back to the middle change to original sprite frame
    sprite.position.x = this.frame.centerX;
    sprite.position.y = this.frame.centerY;
    sprite.frame = 0;
  },
  refreshStats: function refreshStats(counter) {
    // reduce counter, if not already 0
    if (this.circlesLeft > 0) {
      this.circlesLeft += counter;
    }

    this.circleScore.text = this.circlesLeft;
  },
  seeGrid: function seeGrid() {
    var gridString = '';

    for (var i = 0; i < this.NUM_ROWS; i++) {
      gridString += '\n';

      for (var j = 0; j < this.NUM_COLS; j++) {
        gridString += ' ' + this.gridMatrix[i][j];
      }
    }

    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json' // if (!this.circlesLeft) {
      // 	const data = JSON.stringify(this.gridMatrix);
      // 	console.log('sending results');
      // 	axios.post('http://127.0.0.1:3000/result', data, { headers: headers })
      // 		.then((res, err) => {
      // 			if (err) return console.error(err);
      // 			console.log(res);
      // 		})
      // }

    };
  },
  snapToGrid: function snapToGrid(sprite) {
    for (var i = 0; i < this.rect.length; i++) {
      if (this.rect[i].contains(sprite.x, sprite.y)) {
        sprite.centerX = this.rect[i].centerX;
        sprite.centerY = this.rect[i].centerY;
        break;
      }
    }
  },
  justAClick: function justAClick(sprite) {
    var distanceFromLastUp = Phaser.Math.distance(game.input.activePointer.positionDown.x, game.input.activePointer.positionDown.y, game.input.activePointer.x, game.input.activePointer.y);
    return distanceFromLastUp != 0;
  }
  /*
  // Debugging...
  render: function () {
  		// input some debug info on the screen
  		game.debug.inputInfo(400, 200, '#000');
  		game.debug.text(this.result, 10, 20, '#000');
  		game.debug.timer(this.result, 400, 300, '#000');
  		game.debug.rectangle(this.frame, '#ffff00', false);
  	}
  */

};
exports.default = _default;
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63068" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/states/GameState.js"], null)
//# sourceMappingURL=/GameState.c607a544.map