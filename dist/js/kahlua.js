(function() {
  window.Kahlua = window.Kahlua || {};

}).call(this);

(window.JST || (window.JST = {}))["kahlua-horizontal_scroller"] = function() { return "<div class=\"horizontal_scroller\"><div class=\"contained\">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><a data-bind=\"click : scrollLeft, visible : left_button_visible\" class=\"scroller scroll-left\"><i class=\"icon-chevron-left\"></i></a><a data-bind=\"click : scrollRight, visible : right_button_visible\" class=\"scroller scroll-right\"><i class=\"icon-chevron-right\"></i></a></div>"; };
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Kahlua.HorizontalScroller = (function(superClass) {
    extend(HorizontalScroller, superClass);

    function HorizontalScroller() {
      this.scrollRight = bind(this.scrollRight, this);
      this.scrollLeft = bind(this.scrollLeft, this);
      this.updateScrollBounds = bind(this.updateScrollBounds, this);
      this.init = bind(this.init, this);
      return HorizontalScroller.__super__.constructor.apply(this, arguments);
    }

    HorizontalScroller.registerComponent('kahlua-horizontal_scroller', {
      template_id: 'kahlua-horizontal_scroller',
      synchronous: true
    });

    HorizontalScroller.prototype.init = function() {
      this.scroll_region = $(this.element).find(".contained");
      this.left_button = $(this.element).find(".scroll-left");
      this.right_button = $(this.element).find(".scroll-right");
      this.left = ko.observable(0);
      this.children_width = ko.observable(0);
      this.window_width = ko.observable(0);
      setTimeout((function(_this) {
        return function() {
          $(_this.element).find(".contained").children().each(function(idx, child) {
            return _this.children_width(_this.children_width() + $(child).outerWidth(true));
          });
          return _this.updateScrollBounds();
        };
      })(this), 0);
      this.left_button_visible = ko.pureComputed((function(_this) {
        return function() {
          return _this.left() < 0;
        };
      })(this));
      this.right_button_visible = ko.pureComputed((function(_this) {
        return function() {
          return _this.left() > _this.window_width() - _this.children_width();
        };
      })(this));
      return $(window).on('resize', (function(_this) {
        return function() {
          return _this.updateScrollBounds();
        };
      })(this));
    };

    HorizontalScroller.prototype.updateScrollBounds = function() {
      return this.window_width($(this.element).find(".horizontal_scroller").innerWidth());
    };

    HorizontalScroller.prototype.scrollLeft = function() {
      this.left(this.left() + 180);
      return this.scroll_region.animate({
        left: this.left()
      }, 100);
    };

    HorizontalScroller.prototype.scrollRight = function() {
      this.left(this.left() - 180);
      return this.scroll_region.animate({
        left: this.left()
      }, 100);
    };

    return HorizontalScroller;

  })(QS.View);

}).call(this);

(window.JST || (window.JST = {}))["kahlua-scrolling_pagination"] = function() { return "<div class=\"scrolling-pagination\"><div class=\"contained\">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><div class=\"page-bottom-canary\"><i data-bind=\"css : {fa-spinner: isDataLoading}\" class=\"fa fa-spin\"></i>{{#if : pstate() == PSTATE_CONTENT_CONSUMED }}There\'s nothing left...{{/if }}</div></div>"; };
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Kahlua.ScrollingPagination = (function(superClass) {
    extend(ScrollingPagination, superClass);

    function ScrollingPagination() {
      this.PSH_enterIdle = bind(this.PSH_enterIdle, this);
      this.onContentConsumed = bind(this.onContentConsumed, this);
      this.onFetchFinish = bind(this.onFetchFinish, this);
      this.onFetchStart = bind(this.onFetchStart, this);
      this.PS_canaryVisible = bind(this.PS_canaryVisible, this);
      this.onStart = bind(this.onStart, this);
      this.dispose = bind(this.dispose, this);
      this.updateCanaryPosition = bind(this.updateCanaryPosition, this);
      this.init = bind(this.init, this);
      return ScrollingPagination.__super__.constructor.apply(this, arguments);
    }

    ScrollingPagination.registerComponent('kahlua-scrolling_pagination', {
      template_id: 'kahlua-scrolling_pagination',
      synchronous: true
    });

    ScrollingPagination.prototype.PSTATE_START = 0;

    ScrollingPagination.prototype.PSTATE_FETCHING = 1;

    ScrollingPagination.prototype.PSTATE_PRE_IDLE_COOLDOWN = 2;

    ScrollingPagination.prototype.PSTATE_IDLE = 3;

    ScrollingPagination.prototype.PSTATE_CONTENT_CONSUMED = 4;

    ScrollingPagination.prototype.PSTATE_ERROR = 5;

    ScrollingPagination.prototype.init = function() {
      this.pstate = ko.observable(this.PSTATE_START);
      this.delegate = this.opts.delegate;
      this.canaryPosition = ko.observable(0);
      this.isCanaryVisible = ko.pureComputed((function(_this) {
        return function() {
          var window;
          window = _this.app.window_bounds();
          return _this.canaryPosition() <= window.scrollTop + window.height;
        };
      })(this));
      this.isCanaryVisible.subscribe((function(_this) {
        return function() {
          if (_this.isCanaryVisible()) {
            return _this.PS_canaryVisible();
          }
        };
      })(this));
      this.isStart = ko.pureComputed((function(_this) {
        return function() {
          return _this.pstate() === _this.PSTATE_START;
        };
      })(this));
      this.isDataLoading = ko.pureComputed((function(_this) {
        return function() {
          return _this.pstate() === _this.PSTATE_FETCHING;
        };
      })(this));
      this.canary_checker = setInterval((function(_this) {
        return function() {
          return _this.updateCanaryPosition();
        };
      })(this), 1000);
      if (this.delegate.register != null) {
        return this.delegate.register(this);
      }
    };

    ScrollingPagination.prototype.updateCanaryPosition = function() {
      var canary, ref;
      canary = $(this.element).find(".page-bottom-canary");
      return this.canaryPosition((ref = canary.offset()) != null ? ref.top : void 0);
    };

    ScrollingPagination.prototype.dispose = function() {
      clearInterval(this.canary_checker);
      return ScrollingPagination.__super__.dispose.call(this);
    };

    ScrollingPagination.prototype.onStart = function() {
      if (this.idle_timeout != null) {
        cancelTimout(this.idle_timeout);
        this.idle_timeout = null;
      }
      return this.pstate(this.PSTATE_START);
    };

    ScrollingPagination.prototype.PS_canaryVisible = function() {
      switch (this.pstate()) {
        case this.PSTATE_IDLE:
          return this.delegate.fetchNext(this);
      }
    };

    ScrollingPagination.prototype.onFetchStart = function() {
      switch (this.pstate()) {
        case this.PSTATE_START:
        case this.PSTATE_IDLE:
          return this.pstate(this.PSTATE_FETCHING);
        default:
          return console.log("got PS_fetchStart in state " + (this.pstate()));
      }
    };

    ScrollingPagination.prototype.onFetchFinish = function() {
      switch (this.pstate()) {
        case this.PSTATE_FETCHING:
          return this.PSH_enterIdle();
        case this.PSTATE_CONTENT_CONSUMED:
          break;
        default:
          return console.log("got PS_fetchFinish in state " + (this.pstate()));
      }
    };

    ScrollingPagination.prototype.onContentConsumed = function() {
      switch (this.pstate()) {
        case this.PSTATE_FETCHING:
          return this.pstate(this.PSTATE_CONTENT_CONSUMED);
        default:
          return console.log("got PS_contentConsumed in state " + (this.pstate()));
      }
    };

    ScrollingPagination.prototype.PSH_enterIdle = function() {
      this.pstate(this.PSTATE_PRE_IDLE_COOLDOWN);
      this.idle_timeout = null;
      return this.idle_timeout = setTimeout((function(_this) {
        return function() {
          _this.idle_timeout = null;
          return _this.pstate(_this.PSTATE_IDLE);
        };
      })(this), 500);
    };

    return ScrollingPagination;

  })(QS.View);

}).call(this);
