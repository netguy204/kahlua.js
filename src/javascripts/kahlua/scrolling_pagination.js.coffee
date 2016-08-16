class Kahlua.ScrollingPagination extends QS.View
  @registerComponent 'kahlua-scrolling_pagination',
    template_id: 'kahlua-scrolling_pagination'
    synchronous: true

  init : =>
    @onScrollBottom = @opts.onScrollBottom

    @isDataLoading = ko.pureComputed =>
      if @opts.isDataLoading?
        @opts.isDataLoading()
      else
        false

    @isDataConsumed = ko.pureComputed =>
      if @opts.isDataConsumed?
        @opts.isDataConsumed()
      else
        true

    # COMPUTED
    @canaryPosition = ko.observable(0)

    @isCanaryVisible = ko.pureComputed =>
      window = @app.window_bounds()
      @canaryPosition() <= window.scrollTop + window.height

    @isCanaryVisible.subscribe =>
      if @isCanaryVisible()
        @onCanaryVisible()

    @canary_checker = setInterval( =>
      @updateCanaryPosition()
    , 1000)

    # can we send another fetch notification?
    @cooldownExpired = true

  updateCanaryPosition : =>
    # where is the canary relative to the top of the page?
    canary = $(@element).find(".page-bottom-canary")
    @canaryPosition(canary.offset()?.top)

  dispose: =>
    clearInterval(@canary_checker)
    super()

  onCanaryVisible : =>
    unless @isDataLoading() || @isDataConsumed()
      if @cooldownExpired
        @onScrollBottom()

        setTimeout(=>
          @cooldownExpired = true
        , 500)
