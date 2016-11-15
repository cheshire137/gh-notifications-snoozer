const assert = require('assert')
const GitHub = require('../../src/models/GitHub')
const fetchMock = require('fetch-mock')
const Config = require('../../src/config.json')
const fixtures = require('../fixtures')

describe('GitHub', () => {
  describe('getNotifications', () => {
    const date = new Date()

    const notifications = [{
      id: '153473891',
      last_read_at: '2016-07-22T19:36:40Z',
      reason: 'team_mention',
    }]

    before(() => {
      const since = encodeURIComponent(date.toISOString())
      fetchMock.get(`${Config.githubApiUrl}/notifications?since=${since}`,
                    notifications)
    })

    it('returns a list of notifications', done => {
      const github = new GitHub()
      github.getNotifications(date).then(actual => {
        assert.deepEqual(notifications, actual)
        done()
      })
    })
  })

  describe('getTasks', () => {
    it('returns a list of tasks', done => {
      const url = `${Config.githubApiUrl}/search/issues?q=cats%20is%3Aopen&per_page=100`
      fetchMock.get(url, { items: [fixtures.pullRequest] })

      const github = new GitHub('fake-token')
      const filter = { query: 'cats' }
      github.getTasks(filter).then(actual => {
        assert.equal('object', typeof actual.tasks, 'should have list of tasks property')
        assert.equal(null, actual.nextUrl, 'should not have a second page')
        assert.equal(url, actual.currentUrl, 'should have URL that was fetched')
        assert.equal(1, actual.tasks.length, 'should have one task')
        assert.equal(fixtures.task.specialKey, actual.tasks[0].specialKey, 'not the same task')
        done()
      })
    })

    it('returns a list of updated tasks', done => {
      const url = `${Config.githubApiUrl}/search/issues?q=cats%20updated%3A%3E2014-06-11T16%3A48%3A20Z&per_page=100`
      fetchMock.get(url, { items: [fixtures.pullRequest] })

      const github = new GitHub('fake-token')
      const filter = { query: 'cats', updatedAt: '2014-06-11T16:48:20Z' }
      github.getTasks(filter).then(actual => {
        assert.equal('object', typeof actual.tasks, 'should have list of tasks property')
        assert.equal(null, actual.nextUrl, 'should not have a second page')
        assert.equal(url, actual.currentUrl, 'should have URL that was fetched')
        assert.equal(1, actual.tasks.length, 'should have one task')
        assert.equal(fixtures.task.specialKey, actual.tasks[0].specialKey, 'not the same task')
        done()
      })
    })
  })

  describe('getNextUrlFromLink', () => {
    it('returns next link', () => {
      const header = '<https://api.github.com/search/code?q=addClass' +
          '+user%3Amozilla&page=15>; rel="next", <https://api.github.com' +
          '/search/code?q=addClass+user%3Amozilla&page=34>; rel="last", ' +
          '<https://api.github.com/search/code?q=addClass+user%3Amozilla&' +
          'page=1>; rel="first", <https://api.github.com/search/' +
          'code?q=addClass+user%3Amozilla&page=13>; rel="prev"'

      const expected = 'https://api.github.com/search/code?q=addClass+user%3Amozilla&page=15'

      const github = new GitHub()
      const actual = github.getNextUrlFromLink(header)

      assert.equal(expected, actual)
    })
  })
})
