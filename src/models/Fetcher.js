require('isomorphic-fetch')

class Fetcher {
  get(url, opts) {
    const options = opts || {}
    options.method = 'GET'
    console.info('GET', url)
    return this.makeRequest(url, options)
  }

  patch(url, opts) {
    const options = opts || {}
    options.method = 'PATCH'
    console.info('PATCH', url)
    return this.makeRequest(url, options)
  }

  post(url, opts) {
    const options = opts || {}
    options.method = 'POST'
    console.info('POST', url, opts)
    return this.makeRequest(url, options).then(json => json.data)
  }

  makeRequest(url, opts) {
    const options = opts || {}
    if (typeof options.headers === 'undefined') {
      options.headers = {}
    }
    return fetch(url, options).then(response => {
      if (!response.ok) {
        return response.json().then(json => {
          throw new Error(`${response.status}: ${JSON.stringify(json)}`)
        })
      }

      if (options.ignoreBody) {
        return {}
      }

      return response.json()
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
