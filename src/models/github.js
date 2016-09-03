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
    return this.get(urlPath).then(({ items }) => items.map(task => {
      const repoUrl = task.repository_url
      return {
        id: task.id,
        type: typeof task.pull_request === 'object' ? 'pull' : 'issue',
        title: task.title,
        body: task.body,
        state: task.state,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        closedAt: task.closed_at,
        isPullRequest: !!task.pull_request,
        repositoryApiUrl: repoUrl,
        url: task.html_url,
        number: task.number,
        repository: repoUrl.slice(repoUrlPrefix.length),
        user: {
          login: task.user.login,
          avatarUrl: task.user.avatar_url,
          url: task.user.html_url,
          type: task.user.type,
        },
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
