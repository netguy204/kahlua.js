Kahlua.utils ||= {}

Kahlua.utils.sortWithIDOrder = (models, ids_array, opts={})->
	df = opts.default
	df = Number.POSITIVE_INFINITY if !df?

	ids = ko.unwrap(ids_array)
	return models if !ids? || ids.length == 0
	return models.sort (m1, m2)->
		m1v = ids.indexOf(m1.id())
		m1v = def if m1v == -1
		m2v = ids.indexOf(m2.id())
		m2v = def if m2v == -1
		m1v - m2v
