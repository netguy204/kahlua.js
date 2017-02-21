ko.bindingHandlers.menuVisible =
  init: (element, valueAccessor, bindingsAccessor, viewModel, bindingContext) ->
    $el = $(element)
    obs = valueAccessor()
    vis_cls = bindingsAccessor.get('menuVisibleClass')

    if !vis_cls?
      if obs() then $el.show() else $el.hide()

    obs_sub = obs.subscribe (val)->
      if val
        if vis_cls? then $el.addClass(vis_cls) else $el.show()
        obs.menu_visible_at = Date.now()
      else
        if vis_cls? then $el.removeClass(vis_cls) else $el.hide()

    # handle document clicks
    $(document).on 'click.menuVisible', (ev)->
      if obs() == true && obs.menu_visible_at? && (Date.now() - obs.menu_visible_at) > 100
        QS.log "Hiding menu."
        obs(false)

    $el.on 'click.menuVisible', (ev)->
      obs(false)

    ko.utils.domNodeDisposal.addDisposeCallback element, ->
      obs_sub.dispose() if obs_sub?
      $(document).off('click.menuVisible')
      $el.off('click.menuVisible')

