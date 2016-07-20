const fs = require('fs')
const path = require('path')
const Config = require('../config.json')
const Fetcher = require('./fetcher')

class GitHub extends Fetcher {
  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications() {
    return this.get('notifications')
  }

  static getToken() {
    const tokenPath = path.join(__dirname, '..', '..', '.env')
    return fs.readFileSync(tokenPath).toString()
  }

  get(relativeUrl) {
    const url = `${Config.githubApiUrl}/${relativeUrl}`
    const options = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }
    console.log('github get', url, options)
    return this.get(url, options)
  }
}

module.exports = GitHub
