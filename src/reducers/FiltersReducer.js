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

const filtersSelect = (filters, action) => {
  const updatedFilters = Object.assign({}, filters)
  Object.keys(updatedFilters).forEach(name => {
    const select = (name === action.name)
    updatedFilters[name].selected = select
  })

  return updatedFilters
}

module.exports = (filters = {}, action) => {
  switch (action.type) {
    case 'FILTERS_UPDATE':
      return filtersUpdate(filters, action)
    case 'FILTERS_REMOVE':
      return filtersRemove(filters, action)
    case 'FILTERS_SELECT':
      return filtersSelect(filters, action)
    default:
      return filters
  }
}
