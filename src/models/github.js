'use strict'

const fs = require('fs')
const path = require('path')
const Config = require('../config.json')
const Fetcher = require('./fetcher')

const repoUrlPrefix = 'https://api.github.com/repos/'

function getTask(data) {
  const repoUrl = data.repository_url
  const repository = repoUrl.slice(repoUrlPrefix.length)
  const repositoryOwner = repository.split('/')[0]
  return {
    id: data.id,
    type: typeof data.pull_request === 'object' ? 'pull' : 'issue',
    title: data.title,
    body: data.body,
    state: data.state,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    isPullRequest: !!data.pull_request,
    repositoryApiUrl: repoUrl,
    url: data.html_url,
    number: data.number,
    repository,
    repositoryOwner: {
      login: repositoryOwner,
      url: `https://github.com/${repositoryOwner}`,
      avatarUrl: `https://github.com/${repositoryOwner}.png?size=16`,
    },
    user: {
      login: data.user.login,
      url: data.user.html_url,
      avatarUrl: `https://github.com/${data.user.login}.png?size=16`,
      type: data.user.type,
    },
  }
}

class GitHub extends Fetcher {
  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications() {
    return this.get('notifications')
  }

  // https://developer.github.com/v3/search/#search-issues
  getTasks(query = Config.searchQuery) {
    const urlPath = `search/issues?q=${encodeURIComponent(query)}&sort=updated`
    return this.get(urlPath).then(({ items }) => items.map(d => getTask(d)))
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
