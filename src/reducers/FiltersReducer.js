const ensureFilterSelected = (filters) => {
  if (filters.length === 0) {
    return filters
  } else if (filters.find(filter => filter.selected)) {
    return filters
  }

  const first = Object.assign({}, filters[0], { selected: true })
  const rest = filters.slice(1)
  return [first, ...rest]
}

const filtersUpdate = (filters, action) => {
  let updatedFilters = null

  if (!filters.find(filter => filter.name === action.filter.name)) {
    const newFilter = { name: action.filter.name, query: action.filter.query }
    updatedFilters = filters.concat([newFilter])
  } else {
    updatedFilters = filters.map(filter => {
      if (filter.name === action.filter.name) {
        return Object.assign({}, filter, action.filter)
      }
      return filter
    })
  }

  return ensureFilterSelected(updatedFilters)
}

const filtersRemove = (filters, action) => {
  const updatedFilters = filters.filter(filter => filter.name !== action.filter.name)
  return ensureFilterSelected(updatedFilters)
}

const filtersSelect = (filters, action) => {
  const filterToSelect = action.filter || {}
  const updatedFilters = filters.map(filter => {
    const shouldSelect = (filter.name === filterToSelect.name)
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
