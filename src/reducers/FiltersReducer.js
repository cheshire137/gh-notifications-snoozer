const ensureFilterSelected = (existingFilters) => {
  if (existingFilters.length === 0) {
    return existingFilters
  }
  if (existingFilters.find(f => f.selected)) {
    return existingFilters
  }

  const first = Object.assign({}, existingFilters[0], { selected: true })
  const rest = existingFilters.slice(1)
  return [first, ...rest]
}

const filtersUpdate = (existingFilters, { filter }) => {
  let updatedFilters = null

  if (existingFilters.find(f => f.name === filter.name)) {
    updatedFilters = existingFilters.map(f => {
      if (f.name === filter.name) {
        return Object.assign({}, f, filter)
      }
      return f
    })
  } else {
    const newFilter = { name: filter.name, query: filter.query }
    updatedFilters = existingFilters.concat([newFilter])
  }

  return ensureFilterSelected(updatedFilters)
}

const filtersRemove = (existingFilters, { filter }) => {
  const updatedFilters = existingFilters.filter(f => f.name !== filter.name)
  return ensureFilterSelected(updatedFilters)
}

const filtersSelect = (existingFilters, { filter }) => {
  const filterToSelect = filter || {}
  const updatedFilters = existingFilters.map(f => {
    const shouldSelect = (f.name === filterToSelect.name)
    return Object.assign({}, f, { selected: shouldSelect })
  })

  return updatedFilters
}

module.exports = (existingFilters = [], action) => {
  switch (action.type) {
    case 'FILTERS_UPDATE':
      return filtersUpdate(existingFilters, action)
    case 'FILTERS_REMOVE':
      return filtersRemove(existingFilters, action)
    case 'FILTERS_SELECT':
      return filtersSelect(existingFilters, action)
    default:
      return existingFilters
  }
}
