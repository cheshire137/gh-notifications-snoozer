const filtersUpdate = (filters, action) => {
  if (!filters.find(filter => filter.name === action.filter.name)) {
    const newFilter = { name: action.filter.name, query: action.filter.query }
    return filters.concat([newFilter])
  }

  const updatedFilters = filters.map(filter => {
    if (filter.name === action.filter.name) {
      return Object.assign({}, filter, action.filter)
    }
    return filter
  })

  return updatedFilters
}

const filtersRemove = (filters, action) => {
  const updatedFilters = filters.filter(filter => filter.name !== action.filter.name)
  return updatedFilters
}

const filtersSelect = (filters, action) => {
  const filterToSelect = action.filter || {}
  const updatedFilters = filters.map(filter => {
    const shouldSelect = filter.name === filterToSelect.name
    return Object.assign({}, filter, { selected: shouldSelect })
  })
  return updatedFilters
}

module.exports = (filters = [], action) => {
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
