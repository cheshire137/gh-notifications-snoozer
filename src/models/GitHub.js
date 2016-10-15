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
  getNotifications(sinceDate) {
    let date = sinceDate
    if (typeof date === 'undefined') {
      date = new Date()
      date.setDate(date.getDate() - 31)
    }
    const dateStr = date.toISOString()
    return this.get(`notifications?since=${encodeURIComponent(dateStr)}`,
                    { fetchAll: true }).then(result => result.json)
  }

  // https://developer.github.com/v3/search/#search-issues
  getTasks(query = Config.searchQuery) {
    const urlPath = `search/issues?q=${encodeURIComponent(query)}`
    return this.getTasksFromUrl(urlPath)
  }

  getTasksFromUrl(urlPath) {
    return this.get(urlPath).then(result => {
      const { json, nextUrl } = result
      return { tasks: json.items.map(d => getTask(d)), nextUrl,
               currentUrl: urlPath }
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
    return super.patch(url, options)
  }

  getHeaders() {
    if (!this.token) {
      this.token = GitHubAuth.getToken()
    }
    return {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${this.token}`,
    }
  }

  get(path, args = {}) {
    const url = this.getFullUrl(path)
    const opts = { headers: this.getHeaders() }
    return new Promise((resolve, reject) => super.get(url, opts).then(res => {
      const combinedJson = this.combineJson(res.json, args.previousJson)
      const nextUrl = this.getNextUrl(res.headers)
      if (nextUrl && args.fetchAll) {
        return this.get(nextUrl, { previousJson: combinedJson }).
            then(resolve).catch(reject)
      }
      return resolve({ json: combinedJson, nextUrl })
    }).catch(reject))
  }

  combineJson(json1, json2) {
    if (typeof json2 === 'undefined') {
      return json1
    }
    const is1Array = json1.constructor.name === 'Array'
    const is2Array = json2.constructor.name === 'Array'
    if (is1Array && is2Array) {
      return json1.concat(json2)
    }
    return Object.assign({}, json1, json2)
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
