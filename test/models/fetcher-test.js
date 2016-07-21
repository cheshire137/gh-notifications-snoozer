const assert = require('assert')
const Fetcher = require('../../src/models/fetcher')
const fetchMock = require('fetch-mock')

describe('Fetcher', () => {
  describe('get', () => {
    before(() => {
      fetchMock.get('http://example.com', {
        foo: 'bar',
      })
    })

    it('returns a promise that resolves with the JSON response', done => {
      const fetcher = new Fetcher()
      fetcher.get('http://example.com').then(json => {
        assert.equal(1, fetchMock.calls().matched.length)
        assert.deepEqual({ foo: 'bar' }, json)
        fetchMock.restore()
        done()
      })
    })
  })

  describe('getStatus', () => {
    it('includes status and statusText properties', () => {
      const fakeResponse = {
        status: '404',
        statusText: 'Not Found',
      }
      const expected = '404 Not Found'
      const fetcher = new Fetcher()
      assert.equal(expected, fetcher.getStatus(fakeResponse))
    })
  })
})
