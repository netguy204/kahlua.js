(function() {
  window.Kahlua = window.Kahlua || {};

}).call(this);

(window.JST || (window.JST = {}))["kahlua-horizontal_scroller"] = function() { return "<div class=\"horizontal_scroller\"><div class=\"contained\">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><a data-bind=\"click : scrollLeft, visible : left_button_visible\" class=\"scroller scroll-left\"><i class=\"icon-chevron-left\"></i></a><a data-bind=\"click : scrollRight, visible : right_button_visible\" class=\"scroller scroll-right\"><i class=\"icon-chevron-right\"></i></a></div>"; };
(function() {
  Kahlua.utils || (Kahlua.utils = {});

  Kahlua.utils.sortWithIDOrder = function(models, ids_array, opts) {
    var df, ids;
    if (opts == null) {
      opts = {};
    }
    df = opts["default"];
    if (df == null) {
      df = Number.POSITIVE_INFINITY;
    }
    ids = ko.unwrap(ids_array);
    if ((ids == null) || ids.length === 0) {
      return models;
    }
    return models.sort(function(m1, m2) {
      var m1v, m2v;
      m1v = ids.indexOf(m1.id());
      if (m1v === -1) {
        m1v = def;
      }
      m2v = ids.indexOf(m2.id());
      if (m2v === -1) {
        m2v = def;
      }
      return m1v - m2v;
    });
  };

}).call(this);

(window.JST || (window.JST = {}))["kahlua-scrolling_pagination"] = function() { return "<div class=\"scrolling-pagination\"><div class=\"contained\">{{#template : {nodes: $componentTemplateNodes, data: $parent} /}}</div><div class=\"page-bottom-canary\"><i data-bind=\"css : {fa-spinner: isDataLoading}\" class=\"fa fa-spin\"></i></div></div>"; };
(function() {
  ko.bindingHandlers.draggable = {
    init: function(element, valueAccessor, bindingsAccessor, viewModel, bindingContext) {
      var $drop_els, $el, opts, transfer_data;
      opts = ko.unwrap(valueAccessor());
      opts.model_class || (opts.model_class = viewModel.model.getClass().name);
      $el = $(element);
      $el.attr('draggable', true);
      $drop_els = null;
      transfer_data = {
        model_data: viewModel.model.toJS(),
        model_class: opts.model_class
      };
      $el.on('dragstart', function(ev) {
        ev.originalEvent.dataTransfer.setData('model_data', JSON.stringify(transfer_data.model_data));
        ev.originalEvent.dataTransfer.setData('model_class', transfer_data.model_class);
        $el.addClass('dragging');
        return $drop_els = $('[droppable=true]');
      });
      $el.on('dragend', function(ev) {
        $('.dragover').removeClass('dragover');
        $el.removeClass('dragging');
        return $drop_els.each(function() {
          var dropView;
          dropView = ko.dataFor(this);
          if ((dropView != null) && (dropView.handleModelDragOver != null)) {
            return dropView.handleModelDragOver(transfer_data, {
              hit: false,
              dragend: true,
              target: this
            });
          }
        });
      });
      return $el.on('drag', function(ev) {
        var point;
        point = {
          x: ev.originalEvent.pageX,
          y: ev.originalEvent.pageY
        };
        return $drop_els.each(function() {
          var $drop, dropView, hit;
          $drop = $(this);
          hit = QS.utils.elementContainsPoint(this, point);
          dropView = ko.dataFor(this);
          if ((dropView != null) && (dropView.handleModelDragOver != null)) {
            return dropView.handleModelDragOver(transfer_data, {
              hit: hit,
              point: point,
              target: this
            });
          } else {
            if (hit) {
              return $drop.addClass('dragover');
            } else {
              if ($drop.hasClass('dragover')) {
                return $drop.removeClass('dragover');
              }
            }
          }
        });
      });
    },
    update: function(element, valueAccessor, bindingsAccessor, viewModel, bindingContext) {
      var $el, opts;
      opts = ko.unwrap(valueAccessor());
      $el = $(element);
      return $el.attr('draggable', (opts["if"] == null) || opts["if"] === true);
    }
  };

  ko.bindingHandlers.droppable = {
    init: function(element, valueAccessor, bindingsAccessor, viewModel, bindingContext) {
      var $el, enter_count, opts;
      opts = viewModel.droppable_opts = ko.unwrap(valueAccessor());
      enter_count = 0;
      $el = $(element);
      $el.attr('droppable', true);
      $el.on('dragover', function(ev) {
        return ev.preventDefault();
      });

      /*
      		$el.on 'dragenter', (ev)->
      			enter_count += 1
      			if enter_count == 1
      				$target = $(ev.target)
      				$target.addClass('dragover')
      		$el.on 'dragleave', (ev)->
      			enter_count -= 1
      			if enter_count == 0
      				$target = $(ev.target)
      				$target.removeClass('dragover')
       */
      return $el.on('drop', function(ev) {
        var transfer, transfer_data;
        transfer = ev.originalEvent.dataTransfer;
        transfer_data = {};
        transfer_data.model_data = JSON.parse(transfer.getData('model_data'));
        transfer_data.model_class = transfer.getData('model_class');
        return typeof viewModel.handleModelDrop === "function" ? viewModel.handleModelDrop(transfer_data, {
          event: ev
        }) : void 0;
      });
    }
  };

}).call(this);

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
      this.fixed_width = this.opts.fixed_width || 0;
      this.left = ko.observable(0);
      this.children_width = ko.observable(0);
      this.window_width = ko.observable(0);
      if (this.fixed_width === 0) {
        setTimeout((function(_this) {
          return function() {
            $(_this.element).find(".contained").children().each(function(idx, child) {
              return _this.children_width(_this.children_width() + $(child).outerWidth(true));
            });
            return _this.updateScrollBounds();
          };
        })(this), 0);
      } else {
        this.children_width(this.fixed_width);
      }
      setTimeout((function(_this) {
        return function() {
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

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Kahlua.SelectView = (function(superClass) {
    extend(SelectView, superClass);

    function SelectView() {
      this.handleDropdownShown = bind(this.handleDropdownShown, this);
      this.isOptionSelected = bind(this.isOptionSelected, this);
      this.selectOption = bind(this.selectOption, this);
      this.init = bind(this.init, this);
      return SelectView.__super__.constructor.apply(this, arguments);
    }

    SelectView.registerComponent('kahlua-select', {
      html: "<div class='btn-group' data-bind=\"scopeAs : '$comp', event : {'shown.bs.dropdown' : handleDropdownShown}\">\n	<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' data-bind=\"attr.class : classNames\">\n		{{ selected_text }}\n		<span class='caret'></span>\n	</button>\n	<ul class='dropdown-menu'>\n		{{#foreach : {data : flat_options, as : '$option'} }}\n		<li data-bind=\"css.active : $comp.isOptionSelected($option)\">\n			<a data-bind=\"on.click : $comp.selectOption($option)\">{{ $option.text }}</a>\n		</li>\n		{{/foreach }}\n	</ul>\n</div>"
    });

    SelectView.prototype.init = function() {
      this.text_field = this.opts.optionsText;
      this.value_field = this.opts.optionsValue;
      this.caption = this.opts.caption || "Please select...";
      this.value = this.opts.value;
      this.multiple = this.opts.multiple || false;
      this.classNames = "btn btn-default dropdown-toggle " + this.opts.size;
      this.flat_options = ko.pureComputed(function() {
        return ko.unwrap(this.opts.options).map((function(_this) {
          return function(item) {
            return {
              text: $.isFunction(_this.text_field) ? _this.text_field(item) : ko.unwrap(item[_this.text_field]),
              value: $.isFunction(_this.value_field) ? _this.value_field(item) : ko.unwrap(item[_this.value_field])
            };
          };
        })(this));
      }, this);
      this.selected_options = ko.pureComputed(function() {
        var val;
        val = this.value();
        return this.flat_options().filter((function(_this) {
          return function(opt) {
            if (_this.multiple) {
              return val.includes(opt.value);
            } else {
              return val === opt.value;
            }
          };
        })(this));
      }, this);
      return this.selected_text = ko.pureComputed(function() {
        var options, txts;
        options = this.selected_options();
        if (options.length === 0) {
          return this.caption;
        }
        txts = options.map((function(_this) {
          return function(opt) {
            return opt.text;
          };
        })(this));
        return txts.join(", ");
      }, this);
    };

    SelectView.prototype.selectOption = function(option) {
      var base;
      if (this.multiple) {
        if (!this.isOptionSelected(option)) {
          this.value.push(option.value);
        } else {
          this.value.remove(option.value);
        }
      } else {
        this.value(option.value);
      }
      return typeof (base = this.opts).onSelect === "function" ? base.onSelect(option) : void 0;
    };

    SelectView.prototype.isOptionSelected = function(option) {
      if (this.multiple) {
        return this.value().includes(option.value);
      } else {
        return this.value() === option.value;
      }
    };

    SelectView.prototype.handleDropdownShown = function() {
      var base;
      return typeof (base = this.opts).onDropdownShown === "function" ? base.onDropdownShown() : void 0;
    };

    return SelectView;

  })(QS.View);

}).call(this);
