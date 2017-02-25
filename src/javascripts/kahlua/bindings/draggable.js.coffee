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

		# handle touch if necessary
		if !('draggable' in document.createElement('span'))
			$el.on 'touchmove', (ev)->
				return if $el.attr('draggable') != "true"
				dd = $el.data('touchdragdrop')
				if !dd?
					dd = new ko.bindingHandlers.draggable.TouchDragDrop(element)
				#$('body').css("background", "#fff")
				dd.handleTouchMove(ev)

		ko.utils.domNodeDisposal.addDisposeCallback element, ->
			dd = $el.data('touchdragdrop')
			dd.clean() if dd?

	update : (element, valueAccessor, bindingsAccessor, viewModel, bindingContext)->
		opts = ko.unwrap(valueAccessor())
		$el = $(element)
		$el.attr('draggable', !opts.if? || opts.if == true)

class ko.bindingHandlers.draggable.TouchDragDrop
		constructor: (element, opts={})->
			@element = element
			@transfer_data = {}
			@jel = opts.jquery_element || $(element)
			@drag_node = @duplicateNode(element)

			@jel.on 'touchend', @handleTouchEnd
			@jel.data('touchdragdrop', this)
			# trigger drag start
			@dispatchDragStart()
		handleTouchMove : (ev)=>
			ev.preventDefault()
			$dn = $(@drag_node)
			touch = ev.originalEvent.changedTouches[0]
			dnw = @drag_node.offsetWidth
			dnh = @drag_node.offsetHeight
			$dn.css(top: touch.pageY - dnh / 2, left: touch.pageX - dnw / 2)
			@dispatchDrag(ev)
		handleTouchEnd : (ev)=>
			touch = ev.originalEvent.changedTouches[0]
			point = {x: touch.pageX, y: touch.pageY}
			# handle drop
			$drop_els = $('[droppable=true]')
			self = this
			$drop_els.each ->
				return if this == self.drag_node
				if QS.utils.elementContainsPoint(this, point)
					self.dispatchDrop(this, ev)
			# notify drag end
			@dispatchDragEnd()
			@clean()
		clean : =>
			@drag_node.parentNode.removeChild(@drag_node)
			@jel.off 'touchend', @handleTouchEnd
			@jel.data('touchdragdrop', null)
		duplicateNode : ->
			new_node = @element.cloneNode(true)
			@copyStyle(@element, new_node)
			new_node.style.opacity = "0.5"
			new_node.style.position = "absolute"
			new_node.style.zIndex = "999999"
			document.body.appendChild(new_node)
			return new_node
		copyStyle : (srcNode, dstNode)=>
			# Is this node an element?
			if (srcNode.nodeType == 1)
				# Remove any potential conflict attributes
				dstNode.removeAttribute("id")
				dstNode.removeAttribute("class")
				dstNode.removeAttribute("style")
				dstNode.removeAttribute("draggable")

				# Clone the style
				cs = window.getComputedStyle(srcNode)
				for csName in cs
					dstNode.style.setProperty(csName, cs.getPropertyValue(csName), cs.getPropertyPriority(csName))

				# Pointer events as none makes the drag image transparent to document.elementFromPoint()
				dstNode.style.pointerEvents = "none"

			# Do the same for the children
			if srcNode.hasChildNodes()
				for j in [0...srcNode.childNodes.length]
					@copyStyle(srcNode.childNodes[j], dstNode.childNodes[j])
		dispatchDragStart : ->
			evt = document.createEvent("Event")
			evt.initEvent("dragstart", true, true)
			evt.transfer_data
			evt.dataTransfer = {}
			evt.dataTransfer.setData = (type, val)=>
				@transfer_data[type] = val
			evt.dataTransfer.setDragImage = (el, x, y)->
				@drag_node = el
			@element.dispatchEvent(evt)
		dispatchDragEnd : ->
			evt = document.createEvent("Event")
			evt.initEvent("dragend", true, true)
			@element.dispatchEvent(evt)
		dispatchDrag : (tev)->
			evt = @buildEventFromTouchEvent(tev, "drag")
			@element.dispatchEvent(evt)
		dispatchDrop: (element, tev)->
			QS.log 'handing drop'
			QS.log element
			evt = @buildEventFromTouchEvent(tev, "drop")
			evt.dataTransfer = {}
			evt.dataTransfer.getData = (type)=>
				@transfer_data[type]
			element.dispatchEvent(evt)
		buildEventFromTouchEvent : (tev, name)->
			evt = document.createEvent("Event")
			evt.initEvent(name, true, true)
			touch = tev.originalEvent.changedTouches[0]
			evt.pageX = touch.pageX
			evt.pageY = touch.pageY
			return evt
			



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

