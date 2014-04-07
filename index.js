/* Compiled by kdc on Mon Apr 07 2014 20:13:12 GMT+0000 (UTC) */
(function() {
/* KDAPP STARTS */
/* BLOCK STARTS: /home/gokmen/Applications/Gameoflife.kdapp/gameoflife.coffee */
var GameOfLife, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameOfLife = (function(_super) {
  var CELLCOLOR, CELLSIZE, GRIDCOLOR, LIFETIME, WAIT;

  __extends(GameOfLife, _super);

  function GameOfLife() {
    _ref = GameOfLife.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  GRIDCOLOR = "#eee";

  CELLCOLOR = "rgba(4, 156, 83,.8)";

  CELLSIZE = 8;

  LIFETIME = 10000;

  WAIT = 10;

  GameOfLife.prototype.getMap = function() {
    var h, i, j, m, w, _i, _j, _ref1;
    _ref1 = [this.w / CELLSIZE | 0, this.h / CELLSIZE | 0], w = _ref1[0], h = _ref1[1];
    m = [];
    for (i = _i = 0; 0 <= h ? _i <= h : _i >= h; i = 0 <= h ? ++_i : --_i) {
      m.push([]);
      for (j = _j = 0; 0 <= w ? _j <= w : _j >= w; j = 0 <= w ? ++_j : --_j) {
        m[i].push(0);
      }
    }
    return m;
  };

  GameOfLife.prototype.buildScene = function() {
    var context, h, i, w, _i, _ref1, _ref2;
    context = this.context;
    _ref1 = this.getBounds(), w = _ref1.w, h = _ref1.h;
    context.beginPath();
    context.strokeStyle = GRIDCOLOR;
    for (i = _i = 0, _ref2 = Math.max(w, h); CELLSIZE > 0 ? _i <= _ref2 : _i >= _ref2; i = _i += CELLSIZE) {
      context.moveTo(0, i);
      context.lineTo(w, i);
      context.moveTo(i, 0);
      context.lineTo(i, h);
    }
    context.lineWidth = 1;
    return context.stroke();
  };

  GameOfLife.prototype.addDot = function(x, y, keep) {
    if (keep) {
      this.dotmap[y][x] = 1;
      this.updateLog();
    }
    this.context.fillStyle = CELLCOLOR;
    return this.context.fillRect(x * CELLSIZE, y * CELLSIZE, CELLSIZE, CELLSIZE);
  };

  GameOfLife.prototype.rmDot = function(x, y, keep) {
    if (keep) {
      this.dotmap[y][x] = 0;
      this.updateLog();
    }
    this.context.fillStyle = keep ? "white" : "#A7F4BE";
    return this.context.fillRect(x * CELLSIZE, y * CELLSIZE, CELLSIZE, CELLSIZE);
  };

  GameOfLife.prototype.updateLog = function() {
    var line, log, _i, _len, _ref1;
    log = this.getOption('logto');
    this._alive = 0;
    _ref1 = this.dotmap;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      line = _ref1[_i];
      this._alive += this.total(line);
    }
    return log.updatePartial("Generation: " + this._totalgeneration + ", Live cell: " + this._alive);
  };

  GameOfLife.prototype.createDot = function(event, removeIfExists) {
    var layerX, layerY, offsetX, offsetY, x, y;
    event = event.originalEvent;
    offsetX = event.offsetX, offsetY = event.offsetY, layerX = event.layerX, layerY = event.layerY;
    x = (offsetX != null ? offsetX : layerX) / CELLSIZE | 0;
    y = (offsetY != null ? offsetY : layerY) / CELLSIZE | 0;
    if (this.dotmap[y][x]) {
      if (removeIfExists) {
        this.rmDot(x, y, true);
      }
    } else {
      this.addDot(x, y, true);
    }
    return console.info({
      event: event
    });
  };

  GameOfLife.prototype.createCanvas = function() {
    var _ref1,
      _this = this;
    if ((_ref1 = this.canvas) != null) {
      _ref1.destroy();
    }
    this.addSubView(this.canvas = new KDCustomHTMLView({
      tagName: "canvas",
      bind: "mousemove mouseleave",
      attributes: this.getSceneSize()
    }));
    this.context = this.canvas.getElement().getContext("2d");
    this.canvas.on("mousemove", function(event) {
      if (_this._running) {
        return;
      }
      _this._moved = true;
      if (_this._mousedown) {
        return _this.createDot(event);
      }
    });
    this.canvas.on("mousedown", function() {
      return _this._mousedown = true;
    });
    this.canvas.on("mouseleave", function() {
      return _this._mousedown = false;
    });
    this.canvas.on("mouseup", function(event) {
      _this._mousedown = false;
      if (!_this._running) {
        return _this.createDot(event, true);
      }
    });
    return this.buildScene();
  };

  GameOfLife.prototype.cleanup = function() {
    return this.canvas.setAttributes(this.getSceneSize());
  };

  GameOfLife.prototype.getSceneSize = function() {
    var bounds, _ref1;
    bounds = {
      width: this.getWidth(),
      height: this.getHeight()
    };
    _ref1 = [bounds.width, bounds.height], this.w = _ref1[0], this.h = _ref1[1];
    return bounds;
  };

  GameOfLife.prototype.reset = function() {
    this._alive = 0;
    this._generation = 0;
    this._totalgeneration = 0;
    this.getSceneSize();
    this.dotmap = this.getMap();
    this.createCanvas();
    return this.updateLog();
  };

  GameOfLife.prototype.total = function(arr) {
    var i, total;
    total = 0;
    i = arr.length;
    while (i--) {
      total += arr[i];
    }
    return total;
  };

  GameOfLife.prototype.slice = function(x, y) {
    var _ref1;
    return ((_ref1 = this.dotmap[y]) != null ? _ref1.slice(Math.max(0, x - 1), +(x + 1) + 1 || 9e9) : void 0) || [];
  };

  GameOfLife.prototype.stop = function() {
    return this._generation = LIFETIME;
  };

  GameOfLife.prototype.generate = function(reset) {
    var dot, downLevel, line, sameLevel, total, upLevel, x, y, _i, _j, _len, _len1, _map, _ref1,
      _this = this;
    if (reset == null) {
      reset = false;
    }
    if (reset) {
      this._generation = 0;
    }
    if (this._generation >= LIFETIME) {
      this._running = false;
      return console.info("Life is over after " + this._generation + " generation.");
    }
    this._generation++;
    this._totalgeneration++;
    this._running = true;
    _map = this.getMap();
    _ref1 = this.dotmap;
    for (y = _i = 0, _len = _ref1.length; _i < _len; y = ++_i) {
      line = _ref1[y];
      for (x = _j = 0, _len1 = line.length; _j < _len1; x = ++_j) {
        dot = line[x];
        upLevel = this.total(this.slice(x, y - 1));
        sameLevel = this.total(this.slice(x, y)) - dot;
        downLevel = this.total(this.slice(x, y + 1));
        total = this.total([upLevel, sameLevel, downLevel]);
        if (dot) {
          if (total < 2 || total > 3) {
            this.rmDot(x, y);
            _map[y][x] = 0;
          } else {
            this.addDot(x, y);
            _map[y][x] = 1;
          }
        } else if (total === 3) {
          this.addDot(x, y);
          _map[y][x] = 1;
        }
      }
    }
    this.updateLog();
    this.dotmap = _map;
    return KD.utils.wait(WAIT, function() {
      return _this.generate();
    });
  };

  return GameOfLife;

})(KDView);
/* BLOCK STARTS: /home/gokmen/Applications/Gameoflife.kdapp/index.coffee */
var GameoflifeController, GameoflifeMainView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameoflifeMainView = (function(_super) {
  __extends(GameoflifeMainView, _super);

  function GameoflifeMainView(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = 'gameoflife main-view';
    GameoflifeMainView.__super__.constructor.call(this, options, data);
  }

  GameoflifeMainView.prototype.viewAppended = function() {
    var buttons, grid, header, log;
    new KDModalView({
      title: "Game of Life",
      content: "<p>The Game of Life, also known simply as Life, is a cellular automaton \ndevised by the British mathematician John Horton Conway in 1970.</p>\n\n<p>The \"game\" is a zero-player game, meaning that its evolution is \ndetermined by its initial state, requiring no further input. One \ninteracts with the Game of Life by creating an initial configuration\nand observing how it evolves.</p>\n\n<p>You can seed the game by clicking on the map and use the control\nbuttons at the bottom left.</p>",
      buttons: {
        "Got it": {
          callback: function() {
            return this.getDelegate().destroy();
          }
        }
      }
    });
    this.addSubView(header = new KDHeaderView({
      title: "Game of Life",
      type: "medium"
    }));
    header.addSubView(log = new KDView({
      cssClass: 'log'
    }));
    this.addSubView(grid = new GameOfLife({
      cssClass: 'grid',
      logto: log
    }));
    this.addSubView(buttons = new KDView({
      cssClass: 'button-area'
    }));
    buttons.addSubView(new KDButtonView({
      title: "Run",
      cssClass: "solid green",
      callback: function() {
        if (grid._running) {
          this.setTitle('Run');
          return grid.stop();
        } else {
          this.setTitle('Stop');
          return grid.generate(true);
        }
      }
    }));
    buttons.addSubView(new KDButtonView({
      title: "Clear",
      cssClass: "solid red",
      callback: function() {
        return grid.reset();
      }
    }));
    return KD.utils.defer(function() {
      return grid.reset();
    });
  };

  return GameoflifeMainView;

})(KDView);

GameoflifeController = (function(_super) {
  __extends(GameoflifeController, _super);

  function GameoflifeController(options, data) {
    if (options == null) {
      options = {};
    }
    options.view = new GameoflifeMainView;
    options.appInfo = {
      name: "Gameoflife",
      type: "application"
    };
    GameoflifeController.__super__.constructor.call(this, options, data);
  }

  return GameoflifeController;

})(AppController);

(function() {
  var view;
  if (typeof appView !== "undefined" && appView !== null) {
    view = new GameoflifeMainView;
    return appView.addSubView(view);
  } else {
    return KD.registerAppClass(GameoflifeController, {
      name: "Gameoflife",
      routes: {
        "/:name?/Gameoflife": null,
        "/:name?/gokmen/Apps/Gameoflife": null
      },
      dockPath: "/gokmen/Apps/Gameoflife",
      behavior: "application"
    });
  }
})();

/* KDAPP ENDS */
}).call();