'use strict'

import keytar from 'keytar'
import ElectronConfig from 'electron-config'

const isTest = process.env.NODE_ENV === 'test'
const storage = isTest ? new ElectronConfig({ name: 'config-test' }) : null

const SERVICE = 'gh-notifications-snoozer'
const ACCOUNT = 'github'
const KEY = 'token'

class GitHubAuth {
  static isAuthenticated() {
    if (!isTest) {
      return this.getToken() !== null
    }
    return storage.has(KEY)
  }

  static setToken(token) {
    if (this.isAuthenticated()) {
      this.deleteToken()
    }
    keytar.addPassword(SERVICE, ACCOUNT, token)
    if (isTest) {
      storage.set(KEY, token)
    }
  }

  static deleteToken() {
    keytar.deletePassword(SERVICE, ACCOUNT)
    if (isTest) {
      storage.delete(KEY)
    }
  }

  static getToken() {
    if (!isTest) {
      return keytar.getPassword(SERVICE, ACCOUNT)
    }
    return storage.get(KEY)
  }
}

module.exports = GitHubAuth
