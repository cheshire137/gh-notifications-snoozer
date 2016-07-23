'use strict'

const storage = require('electron-json-storage')
const rulesStorageKey = 'rules'

class Rules {
  static findAll() {
    return new Promise((resolve, reject) => {
      storage.has(rulesStorageKey, (hasError, anyRules) => {
        if (hasError) {
          reject(hasError)
        } else if (anyRules) {
          storage.get(rulesStorageKey, (error, ruleKeys) => {
            if (error) {
              reject(error)
            } else {
              resolve(ruleKeys)
            }
          })
        } else {
          resolve([])
        }
      })
    })
  }

  static addKey(ruleKey) {
    return new Promise((resolve, reject) => {
      this.findAll().then(existingRules => {
        const newRules = existingRules
        if (newRules.indexOf(ruleKey) < 0) {
          newRules.push(ruleKey)
        }
        storage.set(rulesStorageKey, newRules, error => {
          if (error) {
            reject(error)
          } else {
            resolve(newRules)
          }
        })
      })
    })
  }
}

module.exports = Rules
