(function() {


}).call(this);

(window.JST || (window.JST = {}))["kahlua-horizontal_scroller"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="horizontal_scroller"><div class="contained">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><a data-bind="click : scrollLeft, visible : left_button_visible" class="scroller scroll-left"><i class="icon-chevron-left"></i></a><a data-bind="click : scrollRight, visible : right_button_visible" class="scroller scroll-right"><i class="icon-chevron-right"></i></a></div>';

}
return __p
};
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Native.main.HorizontalScroller = (function(superClass) {
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
