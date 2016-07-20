const Config = require('../config.json')
const Fetcher = require('./fetcher')

class GitHub extends Fetcher {
  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications() {
    return this.get('notifications')
  }

  get(path) {
    const url = `${Config.githubApiUrl}/${path}`
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
