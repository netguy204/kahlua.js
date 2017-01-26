ko.bindingHandlers.highchart =
  init : (element, valueAccessor, allBindings, viewModel)->
    series = valueAccessor()
    opts = allBindings.get('highchartOptions') || {chart: {}}
    init_opts = ko.unwrap(opts)
    init_opts.series = ko.unwrap(series)
    init_opts.chart.renderTo = element
    chart = new Highcharts.Chart(init_opts)

    supd = ko.computed ->
      sd = ko.unwrap(series)
      ids = (s.id for s in sd)
      #console.log(ids)
      # remove any existing series
      for idx in [(chart.series.length-1)..0] by -1
        s = chart.series[idx]
        if !ids.includes(s.options.id)
          s.remove()
      # add and update series
      for s in sd
        rs = chart.get(s.id)
        if rs
          # update series
          rs.setData(s.data)
        else
          chart.addSeries(s)

    if ko.isObservable(opts)
      oupd = opts.subscribe (topts)->
        chart.update(topts)

    ko.utils.domNodeDisposal.addDisposeCallback element, ->
      supd.dispose() if supd
      oupd.dispose() if oupd
      chart.destroy()