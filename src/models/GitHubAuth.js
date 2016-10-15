'use strict'

import keytar from 'keytar'

const SERVICE = 'gh-notifications-snoozer'
const ACCOUNT = process.env.NODE_ENV === 'test' ? 'github-test' : 'github'

class GitHubAuth {
  static isAuthenticated() {
    return this.getToken() !== null
  }

  static setToken(token) {
    if (this.isAuthenticated()) {
      this.deleteToken()
    }
    keytar.addPassword(SERVICE, ACCOUNT, token)
  }

  static deleteToken() {
    keytar.deletePassword(SERVICE, ACCOUNT)
  }

  static getToken() {
    return keytar.getPassword(SERVICE, ACCOUNT)
  }
}

module.exports = GitHubAuth
