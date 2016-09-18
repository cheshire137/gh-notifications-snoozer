'use strict'

require('isomorphic-fetch')

class Fetcher {
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
      }).catch(reject)
    })
  }

  handleJsonResponse(response, url, resolve, reject) {
    response.json().then((json) => {
      if (response.ok) {
        resolve({ json, headers: response.headers })
      } else {
        const jsonError = json
        jsonError.url = url
        jsonError.status = this.getStatus(response)
        reject(jsonError)
      }
    }).catch((error) => {
      console.error('failed to parse JSON response', error)
      reject({ error })
    })
  }

  getStatus(response) {
    return `${response.status} ${response.statusText}`
  }
}

module.exports = Fetcher
