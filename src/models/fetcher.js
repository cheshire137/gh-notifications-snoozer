const fetch = require('node-fetch')

module.exports = class Fetcher {
  get(url, opts) {
    const options = opts || {}
    options.method = 'GET'
    return this.makeRequest(url, options)
  }

  makeRequest(url, opts) {
    const options = opts || {}
    if (typeof options.headers === 'undefined') {
      options.headers = {}
    }
    return new Promise((resolve, reject) => {
      fetch(url, options).then((response) => {
        this.handleJsonResponse(response, url, resolve, reject)
      })
    })
  }

  handleJsonResponse(response, url, resolve, reject) {
    response.json().then((json) => {
      if (response.ok) {
        resolve(json)
      } else {
        const jsonError = json
        jsonError.url = url
        jsonError.status = this.getStatus(response)
        reject(jsonError)
      }
    }).catch((error) => {
      console.error('failed to parse json response', error)
      reject({ error })
    })
  }

  getStatus(response) {
    return `${response.status} ${response.statusText}`
  }
}
