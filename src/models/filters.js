'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()

const FILTERS_STORAGE_KEY = 'filters'

class Filters {
  static findAll() {
    if (storage.has(FILTERS_STORAGE_KEY)) {
      return storage.get(FILTERS_STORAGE_KEY)
    }
    return []
  }

  static addKey(filterKey) {
    const existingFilters = this.findAll()
    const newFilters = existingFilters
    if (newFilters.indexOf(filterKey) < 0) {
      newFilters.push(filterKey)
    }
    storage.set(FILTERS_STORAGE_KEY, newFilters)
    return newFilters
  }

  static deleteKey(filterKey) {
    const existingFilters = this.findAll()
    const index = existingFilters.indexOf(filterKey)
    const newFilters = existingFilters.slice(0, index).
        concat(existingFilters.slice(index + 1))
    storage.set(FILTERS_STORAGE_KEY, newFilters)
    return newFilters
  }
}

module.exports = Filters
