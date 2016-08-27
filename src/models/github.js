'use strict'

const fs = require('fs')
const path = require('path')
const Config = require('../config.json')
const Fetcher = require('./fetcher')

class GitHub extends Fetcher {
  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications() {
    return this.get('notifications')
  }

  // https://developer.github.com/v3/search/#search-issues
  getTasks(query = Config.searchQuery) {
    const urlPath = `search/issues?q=${encodeURIComponent(query)}&sort=updated`
    const repoUrlPrefix = 'https://api.github.com/repos/'
    return this.get(urlPath).then(({ items }) => items.map(item => {
      const repoUrl = item.repository_url
      return {
        id: item.id,
        type: typeof item.pull_request === 'object' ? 'pull' : 'issue',
        title: item.title,
        body: item.body,
        state: item.state,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        closedAt: item.closed_at,
        repositoryApiUrl: repoUrl,
        url: item.html_url,
        number: item.number,
        repository: repoUrl.slice(repoUrlPrefix.length),
      }
    })
    )
  }

  static getToken() {
    const tokenPath = path.join(__dirname, '..', '..', '.env')
    return fs.readFileSync(tokenPath).toString().trim()
  }

  get(relativeUrl) {
    const url = `${Config.githubApiUrl}/${relativeUrl}`
    const token = GitHub.getToken()
    const options = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
      },
    }
    return super.get(url, options)
  }
}

module.exports = GitHub
