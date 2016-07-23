'use strict'

const storage = require('electron-json-storage')

class Rules {
  constructor(key) {
    this.key = key
  }

  retrieve() {
    return new Promise((resolve, reject) => {
      storage.get(this.key, (error, value) => {
        if (error) {
          reject(error)
        } else {
          resolve(value)
        }
      })
    })
  }

  store(value) {
    return new Promise((resolve, reject) => {
      storage.set(this.key, value, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = Rules
