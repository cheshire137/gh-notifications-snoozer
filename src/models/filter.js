'use strict'

const ElectronConfig = require('electron-config')
const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
const storage = new ElectronConfig({ name: configName })
const Filters = require('./filters')

class Filter {
  constructor(key) {
    this.key = key
  }

  exists() {
    return storage.has(this.key)
  }

  retrieve() {
    if (this.exists()) {
      return storage.get(this.key)
    }
    return {}
  }

  store(value) {
    storage.set(this.key, value)
    return Filters.addKey(this.key)
  }

  delete() {
    storage.delete(this.key)
    return Filters.deleteKey(this.key)
  }
}

module.exports = Filter
