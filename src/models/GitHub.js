const Config = require('../config.json')
const Fetcher = require('./Fetcher')
const GitHubAuth = require('./GitHubAuth')

const REPO_URL_PREFIX = 'https://api.github.com/repos/'

function getTask(data) {
  const repoUrl = data.repository_url
  const repository = repoUrl.slice(REPO_URL_PREFIX.length)
  const repositoryOwner = repository.split('/')[0]
  const type = typeof data.pull_request === 'object' ? 'pull' : 'issue'
  let apiUrl = data.url
  if (type === 'pull') {
    apiUrl = apiUrl.replace(/\/issues\//, '/pulls/')
  }
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
    isPullRequest: type === 'pull',
    repositoryApiUrl: repoUrl,
    url: data.html_url,
    apiUrl,
    number: data.number,
    repository,
    repositoryOwner,
    repositoryOwnerUrl: `https://github.com/${repositoryOwner}`,
    repositoryOwnerAvatar: `https://github.com/${repositoryOwner}.png?size=25`,
    user: data.user.login,
    userUrl: data.user.html_url,
    userAvatar: `https://github.com/${data.user.login}.png?size=20`,
    userType: data.user.type,
    comments: data.comments,
    labels: data.labels,
    milestone: data.milestone,
    assignees: data.assignees,
  }
}

class GitHub extends Fetcher {
  constructor(token) {
    super()
    this.token = token
  }

  post(url, query) {
    const options = { query, headers: this.getHeaders() }
    return super.post(url, options)
  }

  // https://developer.github.com/v3/activity/notifications/#list-your-notifications
  getNotifications(sinceDate) {
    let date = sinceDate
    if (typeof date === 'undefined') {
      date = new Date()
      date.setDate(date.getDate() - 31)
    }
    const dateStr = date.toISOString()
    const url = `notifications?since=${encodeURIComponent(dateStr)}`
    return this.get(url).then(result => result.json)
  }

  // https://developer.github.com/v3/search/#search-issues
  getTasks(filter) {
    const extraParams = filter.updatedAt ? ` updated:>${filter.updatedAt}` : ' is:open'
    const params = `?q=${encodeURIComponent(filter.query + extraParams)}`
    const url = `${Config.githubApiUrl}/search/issues${params}&per_page=100`
    return this.getTasksFromUrl(url)
  }

  getTasksFromUrl(url, items = []) {
    return this.get(url).then(({ json, headers }) => {
      const allItems = items.concat(json.items)
      const nextUrl = this.getNextUrl(headers)
      if (nextUrl) {
        return this.getTasksFromUrl(nextUrl, allItems)
      }

      return { tasks: allItems.map(d => getTask(d)), nextUrl, currentUrl: url }
    })
  }

  // https://developer.github.com/v3/users/#get-the-authenticated-user
  getCurrentUser() {
    return this.get('user').then(result => result.json)
  }

  // https://developer.github.com/v3/activity/notifications/#mark-a-thread-as-read
  markAsRead(url) {
    return this.patch(url, { ignoreBody: true })
  }

  patch(relativeOrAbsoluteUrl, opts) {
    let url = relativeOrAbsoluteUrl
    if (url.indexOf('http') !== 0) {
      url = `${Config.githubApiUrl}/${relativeOrAbsoluteUrl}`
    }
    const options = opts || {}
    options.headers = this.getHeaders()
    return super.post(url, options)
  }

  getHeaders() {
    if (!this.token) {
      this.token = GitHubAuth.getToken()
    }
    return {
      Authorization: `bearer ${this.token}`,
    }
  }

  get(path) {
    const url = this.getFullUrl(path)
    const opts = { headers: this.getHeaders() }
    return super.get(url, opts)
  }

  getFullUrl(relativeOrAbsoluteUrl) {
    if (relativeOrAbsoluteUrl.indexOf('http') !== 0) {
      return `${Config.githubApiUrl}/${relativeOrAbsoluteUrl}`
    }
    return relativeOrAbsoluteUrl
  }

  getNextUrl(headers) {
    const link = headers.get('Link')
    if (!link) {
      return null
    }
    return this.getNextUrlFromLink(link)
  }

  // Sample input:
  // Link: <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=15>; rel="next",
  // <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34>; rel="last",
  // <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=1>; rel="first",
  // <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=13>; rel="prev"
  //
  // Sample output:
  // https://api.github.com/search/code?q=addClass+user%3Amozilla&page=15
  getNextUrlFromLink(link) {
    const urlsAndRels = link.split(',')
    let nextUrl
    urlsAndRels.forEach(str => {
      const urlAndRel = str.trim().split('; ')
      if (urlAndRel[1] === 'rel="next"') {
        const urlInBrackets = urlAndRel[0]
        nextUrl = urlInBrackets.slice(1, urlInBrackets.length - 1)
        return
      }
    })
    return nextUrl
  }
}

module.exports = GitHub
