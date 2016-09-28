'use strict'

const ElectronConfig = require('electron-config')
const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
const storage = new ElectronConfig({ name: configName })

const KEY = 'token'

class GitHubAuth {
  static isAuthenticated() {
    return storage.has(KEY)
  }

  static setToken(token) {
    storage.set(KEY, token)
  }

  static deleteToken() {
    storage.delete(KEY)
  }

  static getToken() {
    return storage.get(KEY)
  }

  static path() {
    return storage.path
  }
}

module.exports = GitHubAuth
