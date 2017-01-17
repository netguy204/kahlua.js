class Kahlua.SelectView extends QS.View
	@registerComponent 'kahlua-select',
		html: """
			<div class='btn-group' data-bind="scopeAs : '$comp', event : {'shown.bs.dropdown' : handleDropdownShown}">
				<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' data-bind="attr.class : classNames">
					{{ selected_text }}
					<span class='caret'></span>
				</button>
				<ul class='dropdown-menu'>
					{{#foreach : {data : flat_options, as : '$option'} }}
					<li data-bind="css.active : $comp.isOptionSelected($option)">
						<a data-bind="on.click : $comp.selectOption($option)">{{ $option.text }}</a>
					</li>
					{{/foreach }}
				</ul>
			</div>
		"""
	init : =>
		@text_field = @opts.optionsText
		@value_field = @opts.optionsValue
		@caption = @opts.caption || "Please select..."
		@value = @opts.value
		@multiple = @opts.multiple || false
		@classNames = "btn btn-default dropdown-toggle #{@opts.size}"
		@flat_options = ko.pureComputed ->
			ko.unwrap(@opts.options).map (item)=>
				{
					text: if $.isFunction(@text_field) then @text_field(item) else ko.unwrap(item[@text_field])
					value: if $.isFunction(@value_field) then @value_field(item) else ko.unwrap(item[@value_field])
				}
		, this
		@selected_options = ko.pureComputed ->
			val = @value()
			@flat_options().filter (opt)=>
				if @multiple then val.includes(opt.value) else val == opt.value
		, this
		@selected_text = ko.pureComputed ->
			options = @selected_options()
			return @caption if options.length == 0
			txts = options.map (opt)=>
				opt.text
			return txts.join(", ")
		, this
	selectOption : (option)=>
		if @multiple
			if !@isOptionSelected(option) then @value.push(option.value) else @value.remove(option.value)
		else
			@value(option.value)
		@opts.onSelect?(option)
	isOptionSelected : (option)=>
		if @multiple
			@value().includes(option.value)
		else
			@value() == option.value
	handleDropdownShown : =>
		@opts.onDropdownShown?()

