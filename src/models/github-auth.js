'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()

const KEY = 'token'

class GitHubAuth {
  static isAuthenticated() {
    return storage.has(KEY)
  }

  static setToken(token) {
    storage.set(KEY, token)
  }

  static getToken() {
    return storage.get(KEY)
  }
}

module.exports = GitHubAuth
