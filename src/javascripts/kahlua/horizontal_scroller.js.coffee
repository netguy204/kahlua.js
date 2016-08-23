class Kahlua.HorizontalScroller extends QS.View
  @registerComponent 'kahlua-horizontal_scroller',
    template_id: 'kahlua-horizontal_scroller'
    synchronous: true


  init : =>
    @scroll_region = $(@element).find(".contained")
    @left_button = $(@element).find(".scroll-left")
    @right_button = $(@element).find(".scroll-right")
    @height = @opts.scroller_height or 180
    @left = ko.observable(0)

    # estimate our width
    @children_width = ko.observable(0)
    @window_width = ko.observable(0)

    setTimeout( =>
      $(@element).find(".contained").children().each (idx, child) =>
        @children_width(@children_width() + $(child).outerWidth(true))
      @updateScrollBounds()
      $(@element).find('.horizontal_scroller').height(@height)
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
    @left(@left() + 180)
    @scroll_region.animate({left: @left()}, 100)

  scrollRight : =>
    @left(@left() - 180)
    @scroll_region.animate({left: @left()}, 100)
