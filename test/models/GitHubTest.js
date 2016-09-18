const assert = require('assert')
const GitHub = require('../../src/models/GitHub')
const fetchMock = require('fetch-mock')
const Config = require('../../src/config.json')

describe('GitHub', () => {
  describe('getNotifications', () => {
    const notifications = [{
      id: '153473891',
      last_read_at: '2016-07-22T19:36:40Z',
      reason: 'team_mention',
    }]

    before(() => {
      fetchMock.get(`${Config.githubApiUrl}/notifications`, notifications)
    })

    it('returns a list of notifications', done => {
      const github = new GitHub()
      github.getNotifications().then(actual => {
        assert.deepEqual(notifications, actual)
        done()
      })
    })
  })

  describe('getNextUrl', () => {
    it('returns next link', () => {
      const header = '<https://api.github.com/search/code?q=addClass' +
          '+user%3Amozilla&page=15>; rel="next", <https://api.github.com' +
          '/search/code?q=addClass+user%3Amozilla&page=34>; rel="last", ' +
          '<https://api.github.com/search/code?q=addClass+user%3Amozilla&' +
          'page=1>; rel="first", <https://api.github.com/search/' +
          'code?q=addClass+user%3Amozilla&page=13>; rel="prev"'

      const expected = 'https://api.github.com/search/code?q=addClass+user%3Amozilla&page=15'

      const github = new GitHub()
      const actual = github.getNextUrl(header)

      assert.equal(expected, actual)
    })
  })
})
