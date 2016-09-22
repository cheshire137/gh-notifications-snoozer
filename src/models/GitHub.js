'use strict'

const Config = require('../config.json')
const Fetcher = require('./Fetcher')
const GitHubAuth = require('./GitHubAuth')

const REPO_URL_PREFIX = 'https://api.github.com/repos/'

function getTask(data) {
  const repoUrl = data.repository_url
  const repository = repoUrl.slice(REPO_URL_PREFIX.length)
  const repositoryOwner = repository.split('/')[0]
  const type = typeof data.pull_request === 'object' ? 'pull' : 'issue'
  return {
    storageKey: `${type}-${data.id}`,
    id: data.id,
    type,
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
    repositoryOwner,
    repositoryOwnerUrl: `https://github.com/${repositoryOwner}`,
    repositoryOwnerAvatar: `https://github.com/${repositoryOwner}.png?size=30`,
    user: data.user.login,
    userUrl: data.user.html_url,
    userAvatar: `https://github.com/${data.user.login}.png?size=16`,
    userType: data.user.type,
  }
}

class GitHub extends Fetcher {
  constructor(token) {
    super()
    this.token = token
  }

  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications() {
    return this.get('notifications')
  }

  // https://developer.github.com/v3/search/#search-issues
  getTasks(query = Config.searchQuery) {
    const urlPath = `search/issues?q=${encodeURIComponent(query)}`
    return this.get(urlPath).then(({ items }) => items.map(d => getTask(d)))
  }

  // https://developer.github.com/v3/users/#get-the-authenticated-user
  getCurrentUser() {
    return this.get('user')
  }

  get(relativeUrl) {
    const url = `${Config.githubApiUrl}/${relativeUrl}`
    const options = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${this.token || GitHubAuth.getToken()}`,
      },
    }
    return super.get(url, options)
  }
}

module.exports = GitHub
