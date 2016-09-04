'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
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
