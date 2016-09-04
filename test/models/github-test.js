const assert = require('assert')
const fs = require('fs')
const path = require('path')
const GitHub = require('../../src/models/github')
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
})
