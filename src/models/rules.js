'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
const rulesStorageKey = 'rules'

class Rules {
  static findAll() {
    if (storage.has(rulesStorageKey)) {
      return storage.get(rulesStorageKey)
    }
    return []
  }

  static addKey(ruleKey) {
    const existingRules = this.findAll()
    const newRules = existingRules
    if (newRules.indexOf(ruleKey) < 0) {
      newRules.push(ruleKey)
    }
    storage.set(rulesStorageKey, newRules)
    return newRules
  }
}

module.exports = Rules
