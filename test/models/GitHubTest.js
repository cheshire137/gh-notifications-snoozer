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
    before(() => {
      fetchMock.get(`${Config.githubApiUrl}/search/issues?per_page=2&q=cats`,
                    { items: [fixtures.pullRequest] })
    })

    it('returns a list of tasks', done => {
      const github = new GitHub('123abc', 2)
      github.getTasks('cats').then(actual => {
        assert.equal('object', typeof actual.tasks,
                     'should have list of tasks property')
        assert.equal(1, actual.tasks.length,
                     'should have one task')
        assert.deepEqual(fixtures.task, actual.tasks[0],
                         'should have the expected task')
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

  describe('combineJson', () => {
    it('combines two arrays', () => {
      const json1 = [{ cat: 1 }]
      const json2 = [{ dog: 2, frog: 3 }]

      const github = new GitHub()
      const actual = github.combineJson(json1, json2)
      assert.deepEqual([{ cat: 1 }, { dog: 2, frog: 3 }], actual)
    })

    it('returns first JSON if second is omitted', () => {
      const json = [{ id: 3, hello: 'yes' }]

      const github = new GitHub()
      const actual = github.combineJson(json)
      assert.deepEqual(json, actual)
    })
  })
})
