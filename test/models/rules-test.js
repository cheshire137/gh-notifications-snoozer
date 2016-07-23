const assert = require('assert')
const storage = require('electron-json-storage')
const Rules = require('../../src/models/rules')

describe('Rules', () => {
  describe('findAll', () => {
    it('returns a list of saved rule names', done => {
      const names = ['mentions:cheshire137', 'involves:org/team']
      storage.set('rules', names, () => {
        Rules.findAll().then(actual => {
          assert.deepEqual(names, actual)
          storage.clear(() => done())
        })
      })
    })

    it('returns an empty list when there are no saved rules', done => {
      Rules.findAll().then(actual => {
        assert(actual instanceof Array)
        assert.equal(0, actual.length)
        storage.clear(() => done())
      })
    })
  })

  describe('addKey', () => {
    it('adds key to rules list', done => {
      Rules.addKey('mentions:cat').then(ruleKeys => {
        // Make sure we resolve the promise with the correct rules list
        assert(ruleKeys instanceof Array)
        assert.equal(1, ruleKeys.length)
        assert.equal('mentions:cat', ruleKeys[0])

        storage.get('rules', (error, actual) => {
          // Make sure what's actually stored is the correct rules list
          assert(actual instanceof Array)
          assert.equal(1, actual.length)
          assert.equal('mentions:cat', actual[0])
          storage.clear(() => done())
        })
      })
    })

    it('does not add duplicate key', done => {
      storage.set('rules', ['neat'], () => {
        Rules.addKey('neat').then(ruleKeys => {
          // Make sure we resolve the promise with the correct rules list
          assert(ruleKeys instanceof Array)
          assert.equal(1, ruleKeys.length)
          assert.equal('neat', ruleKeys[0])

          storage.get('rules', (error, actual) => {
            // Make sure what's actually stored is the correct rules list
            assert(actual instanceof Array)
            assert.equal(1, actual.length)
            assert.equal('neat', actual[0])
            storage.clear(() => done())
          })
        })
      })
    })
  })
})
