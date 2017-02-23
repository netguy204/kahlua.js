ko.bindingHandlers.draggable =
	init : (element, valueAccessor, bindingsAccessor, viewModel, bindingContext)->
		opts = ko.unwrap(valueAccessor())
		opts.model_class ||= viewModel.model.getClass().name
		# set all children draggable element
		$el = $(element)
		$el.attr('draggable', true)
		$drop_els = null
		transfer_data =
			model_data: viewModel.model.toJS()
			model_class: opts.model_class
		$el.on 'dragstart', (ev)->
			ev.originalEvent.dataTransfer.setData('model_data', JSON.stringify(transfer_data.model_data))
			ev.originalEvent.dataTransfer.setData('model_class', transfer_data.model_class)
			$el.addClass('dragging')
			$drop_els = $('[droppable=true]')

		$el.on 'dragend', (ev)->
			$('.dragover').removeClass('dragover')
			$el.removeClass('dragging')
			$drop_els.each ->
				dropView = ko.dataFor(this)
				if dropView? && dropView.handleModelDragOver?
					dropView.handleModelDragOver(transfer_data, {hit: false, dragend: true, target: this, element: element})

		$el.on 'drag', (ev)->
			point = {x: ev.originalEvent.pageX, y: ev.originalEvent.pageY}
			# find all elements that are droppable
			$drop_els.each ->
				$drop = $(this)
				hit = QS.utils.elementContainsPoint(this, point)
				dropView = ko.dataFor(this)
				if dropView? && dropView.handleModelDragOver?
					dropView.handleModelDragOver(transfer_data, {hit: hit, point: point, target: this, element: element})
				else
					if hit
						$drop.addClass('dragover')
					else
						$drop.removeClass('dragover') if $drop.hasClass('dragover')
	update : (element, valueAccessor, bindingsAccessor, viewModel, bindingContext)->
		opts = ko.unwrap(valueAccessor())
		$el = $(element)
		$el.attr('draggable', !opts.if? || opts.if == true)



ko.bindingHandlers.droppable =
	init : (element, valueAccessor, bindingsAccessor, viewModel, bindingContext)->
		opts = viewModel.droppable_opts = ko.unwrap(valueAccessor())
		enter_count = 0
		$el = $(element)
		$el.attr('droppable', true)
		$el.on 'dragover', (ev)-> ev.preventDefault()
		###
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
		###
		$el.on 'drop', (ev)->
			transfer = ev.originalEvent.dataTransfer
			transfer_data = {}
			transfer_data.model_data = JSON.parse(transfer.getData('model_data'))
			transfer_data.model_class = transfer.getData('model_class')
			viewModel.handleModelDrop?(transfer_data, {event: ev, element: element})

