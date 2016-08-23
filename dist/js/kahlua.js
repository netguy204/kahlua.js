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
      this.height = this.opts.scroller_height || 180;
      this.scroll_step = this.opts.scroll_step || 180;
      this.left = ko.observable(0);
      this.children_width = ko.observable(0);
      this.window_width = ko.observable(0);
      setTimeout((function(_this) {
        return function() {
          $(_this.element).find(".contained").children().each(function(idx, child) {
            return _this.children_width(_this.children_width() + $(child).outerWidth(true));
          });
          _this.updateScrollBounds();
          $(_this.element).find(".horizontal_scroller").height(_this.height);
          return $(_this.element).find(".contained").width(_this.children_width());
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
      this.left(this.left() + this.scroll_step);
      return this.scroll_region.animate({
        left: this.left()
      }, 100);
    };

    HorizontalScroller.prototype.scrollRight = function() {
      this.left(this.left() - this.scroll_step);
      return this.scroll_region.animate({
        left: this.left()
      }, 100);
    };

    return HorizontalScroller;

  })(QS.View);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Kahlua.ScrollingPagination = (function(superClass) {
    extend(ScrollingPagination, superClass);

    function ScrollingPagination() {
      this.onCanaryVisible = bind(this.onCanaryVisible, this);
      this.dispose = bind(this.dispose, this);
      this.updateCanaryPosition = bind(this.updateCanaryPosition, this);
      this.init = bind(this.init, this);
      return ScrollingPagination.__super__.constructor.apply(this, arguments);
    }

    ScrollingPagination.registerComponent('kahlua-scrolling_pagination', {
      template_id: 'kahlua-scrolling_pagination',
      synchronous: true
    });

    ScrollingPagination.prototype.init = function() {
      this.onScrollBottom = this.opts.onScrollBottom;
      this.isDataLoading = ko.pureComputed((function(_this) {
        return function() {
          if (_this.opts.isDataLoading != null) {
            return _this.opts.isDataLoading();
          } else {
            return false;
          }
        };
      })(this));
      this.isDataConsumed = ko.pureComputed((function(_this) {
        return function() {
          if (_this.opts.isDataConsumed != null) {
            return _this.opts.isDataConsumed();
          } else {
            return true;
          }
        };
      })(this));
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
            return _this.onCanaryVisible();
          }
        };
      })(this));
      this.canary_checker = setInterval((function(_this) {
        return function() {
          return _this.updateCanaryPosition();
        };
      })(this), 1000);
      return this.cooldownExpired = true;
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

    ScrollingPagination.prototype.onCanaryVisible = function() {
      if (!(this.isDataLoading() || this.isDataConsumed())) {
        if (this.cooldownExpired) {
          this.onScrollBottom();
          return setTimeout((function(_this) {
            return function() {
              return _this.cooldownExpired = true;
            };
          })(this), 500);
        }
      }
    };

    return ScrollingPagination;

  })(QS.View);

}).call(this);

(window.JST || (window.JST = {}))["kahlua-scrolling_pagination"] = function() { return "<div class=\"scrolling-pagination\"><div class=\"contained\">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><div class=\"page-bottom-canary\"><i data-bind=\"css : {fa-spinner: isDataLoading}\" class=\"fa fa-spin\"></i></div></div>"; };