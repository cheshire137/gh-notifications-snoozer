const assert = require('assert')
const simple = require('simple-mock')
const GitHub = require('../../src/models/GitHub')
const fixtures = require('../fixtures')

describe('GitHub', () => {
  describe('getTasks', () => {
    after(() => {
      simple.restore()
    })

    it('returns a list of tasks', done => {
      const github = new GitHub('fake-token')
      const filter = { query: 'cats' }
      simple.mock(github, 'graphql').resolveWith(fixtures.searchResults.data)

      github.getTasks(filter).then(actual => {
        assert.equal(2, actual.tasks.length, 'should have two tasks')
        done()
      })
    })

    it('returns a list of updated tasks', done => {
      const github = new GitHub('fake-token')
      const filter = { query: 'cats', updatedAt: '2014-06-11T16:48:20Z' }
      simple.mock(github, 'graphql').resolveWith(fixtures.searchResults.data)


      github.getTasks(filter).then(actual => {
        assert.equal(2, actual.tasks.length, 'should have one task')
        done()
      })
    })
  })
})
