class Kahlua.ScrollingPagination extends QS.View
  @registerComponent 'kahlua-scrolling_pagination',
    template_id: 'kahlua-scrolling_pagination'
    synchronous: true

  # states related to pagination
  PSTATE_START: 0
  PSTATE_FIRSTFETCH: 1
  PSTATE_PRE_IDLE_COOLDOWN: 2
  PSTATE_IDLE: 3
  PSTATE_PAGEFETCHING: 4
  PSTATE_PAGERENDERING: 5
  PSTATE_CONTENT_CONSUMED: 6
  PSTATE_ERROR: 7

  # events related to pagination
  #
  # PS_canaryVisible
  # PS_firstFetchStart
  # PS_firstFetchFinish
  # PS_pageFetchStart
  # PS_pageFetchFinish
  # PS_resultSaidNoMore

  init : =>
    # current pagination state
    @pstate = ko.observable(@PSTATE_START)
    @delegate = @opts.delegate

    # COMPUTED
    @canaryPosition = ko.observable(0)

    @isCanaryVisible = ko.pureComputed =>
      window = @app.window_bounds()
      @canaryPosition() <= window.scrollTop + window.height

    @isCanaryVisible.subscribe =>
      if @isCanaryVisible()
        @PS_canaryVisible()


    @isStart = ko.pureComputed =>
      @pstate() == @PSTATE_START

    @isDataLoading = ko.pureComputed =>
      state = @pstate()
      state == @PSTATE_FIRSTFETCH || state == @PSTATE_PAGEFETCHING

    @canary_checker = setInterval( =>
      @updateCanaryPosition()
    , 1000)

    # now that initialization is finished, let the delegate know
    if @delegate.register?
      @delegate.register(@)

  updateCanaryPosition : =>
    # where is the canary relative to the top of the page?
    canary = $(@element).find(".page-bottom-canary")
    @canaryPosition(canary.offset()?.top)

  dispose: =>
    clearInterval(@canary_checker)
    super()

  # implementation of the pagination state machine
  onStart : =>
    if @idle_timeout?
      cancelTimout(@idle_timeout)
      @idle_timeout = null

    @pstate(@PSTATE_START)

  PS_canaryVisible : =>
    switch @pstate()
      when @PSTATE_IDLE
        @delegate.fetchNext(@)
        @pstate(@PSTATE_PAGEFETCHING)
      else

  onFirstFetchStart : =>
    switch @pstate()
      when @PSTATE_START, @PSTATE_IDLE, @PSTATE_CONTENT_CONSUMED, @PSTATE_FIRSTFETCH
        @pstate(@PSTATE_FIRSTFETCH)
      else
        console.log("got PS_firstFetchStart in state #{@pstate()}")

  onFirstFetchFinish : =>
    switch @pstate()
      when @PSTATE_FIRSTFETCH
        @PSH_enterIdle()
      when @PSTATE_CONTENT_CONSUMED
        # do nothing, we're done
      else
        console.log("got PS_firstFetchFinish in state #{@pstate()}")

  onPageFetchStart : =>
    switch @pstate()
      when @PSTATE_IDLE
        @pstate(@PSTATE_PAGEFETCHING)
      else
        console.log("got PS_pageFetchStart in state #{@pstate()}")

  onPageFetchFinish : =>
    switch @pstate()
      when @PSTATE_PAGEFETCHING
        @PSH_enterIdle()
      when @PSTATE_CONTENT_CONSUMED
        # do nothing, we're done
      else
        console.log("got PS_pageFetchFinish in state #{@pstate()}")

  onResultSaidNoMore : =>
    switch @pstate()
      when @PSTATE_FIRSTFETCH, @PSTATE_PAGEFETCHING
        @pstate(@PSTATE_CONTENT_CONSUMED)
      else
        console.log("got PS_resultSaidNoMore in state #{@pstate()}")

  # helpers related to pagination state machine
  PSH_enterIdle : =>
    @pstate(@PSTATE_PRE_IDLE_COOLDOWN)
    @idle_timeout = null
    @idle_timeout = setTimeout(=>
      @idle_timeout = null
      @pstate(@PSTATE_IDLE)
    , 500)
