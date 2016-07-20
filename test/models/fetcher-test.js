const assert = require('assert')

const GitHub = require('../../src/models/fetcher')

describe('Fetcher', () => {
  describe('getStatus', () => {
    it('includes status and statusText properties', () => {
      const fakeResponse = {
        status: '404',
        statusText: 'Not Found',
      }
      const expected = '404 Not Found'
      const github = new GitHub()
      assert(expected === github.getStatus(fakeResponse))
    })
  })
})
