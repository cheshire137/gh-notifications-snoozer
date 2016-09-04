'use strict'

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()

const KEY = 'token'

class GitHubAuth {
  isAuthenticated() {
    return storage.has(KEY)
  }

  setToken(token) {
    storage.set(KEY, token)
  }

  getToken() {
    return storage.get(KEY)
  }
}

module.exports = GitHubAuth
