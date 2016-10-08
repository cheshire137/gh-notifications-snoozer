const filters_add = (filters, action) => {
  const newFilter = {}
  newFilter[action.name] = action.query
  return Object.assign({}, filters, newFilter)
}

module.exports = (filters = {}, action) => {
  switch (action.type) {
    case 'FILTERS_ADD':
      return filters_add(filters, action)
    default:
      return filters
  }
}
