'use strict'

const ElectronConfig = require('electron-config')
const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
const storage = new ElectronConfig({ name: configName })

const LAST_FILTER_KEY = 'last-filter'

class LastFilter {
  static save(filterKey) {
    storage.set(LAST_FILTER_KEY, filterKey)
  }

  static retrieve() {
    if (storage.has(LAST_FILTER_KEY)) {
      return storage.get(LAST_FILTER_KEY)
    }
  }
}

module.exports = LastFilter
