'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
const Rules = require('./rules')

class Rule {
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
    Rules.addKey(this.key)
  }
}

module.exports = Rule
