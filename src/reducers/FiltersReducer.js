const filtersUpdate = (filters, action) => {
  const newFilter = {}
  newFilter[action.name] = Object.assign({}, filters[action.name], { query: action.query })
  return Object.assign({}, filters, newFilter)
}

const filtersRemove = (filters, action) => {
  const updatedFilters = Object.assign({}, filters)
  delete updatedFilters[action.name]
  return updatedFilters
}

module.exports = (filters = {}, action) => {
  switch (action.type) {
    case 'FILTERS_UPDATE':
      return filtersUpdate(filters, action)
    case 'FILTERS_REMOVE':
      return filtersRemove(filters, action)
    default:
      return filters
  }
}
