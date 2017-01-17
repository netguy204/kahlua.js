class Kahlua.HorizontalScroller extends QS.View
  @registerComponent 'kahlua-horizontal_scroller',
    template_id: 'kahlua-horizontal_scroller'
    synchronous: true


  init : =>
    @scroll_region = $(@element).find(".contained")
    @left_button = $(@element).find(".scroll-left")
    @right_button = $(@element).find(".scroll-right")
    @height = @opts.scroller_height or 180
    @scroll_step = @opts.scroll_step or 180
    @fixed_width = @opts.fixed_width or 0

    @left = ko.observable(0)

    # estimate our width
    @children_width = ko.observable(0)
    @window_width = ko.observable(0)

    if @fixed_width == 0
      setTimeout( =>
        $(@element).find(".contained").children().each (idx, child) =>
          @children_width(@children_width() + $(child).outerWidth(true))
        @updateScrollBounds()
      , 0)
    else
      @children_width(@fixed_width)

    setTimeout( =>
      $(@element).find(".horizontal_scroller").height(@height)
      $(@element).find(".contained").width(@children_width())
    , 0)

    @left_button_visible = ko.pureComputed =>
      @left() < 0

    @right_button_visible = ko.pureComputed =>
      @left() > @window_width() - @children_width()

    $(window).on 'resize', =>
      @updateScrollBounds()

  updateScrollBounds : =>
    @window_width($(@element).find(".horizontal_scroller").innerWidth())

  scrollLeft : =>
    @left(@left() + @scroll_step)
    @scroll_region.animate({left: @left()}, 100)

  scrollRight : =>
    @left(@left() - @scroll_step)
    @scroll_region.animate({left: @left()}, 100)
