const assert = require('assert')
const storage = require('electron-json-storage')
const Rule = require('../../src/models/rule')

describe('Rule', () => {
  describe('store', () => {
    it('saves the given key/value pair', done => {
      const rule = new Rule('funKey')
      rule.store('glorious value').then(() => {
        storage.get('funKey', (error, actual) => {
          assert.equal('glorious value', actual)
          storage.clear(() => done())
        })
      })
    })
  })

  describe('exists', () => {
    it('returns true when key exists', done => {
      const value = 987
      storage.set('TheBestKey', value, () => {
        const rule = new Rule('TheBestKey')
        rule.exists().then(hasKey => {
          assert(hasKey)
          storage.clear(() => done())
        })
      })
    })

    it('returns false when key does not exist', done => {
      const rule = new Rule('thebestkey')
      rule.exists().then(hasKey => {
        assert(!hasKey)
        storage.clear(() => done())
      })
    })
  })

  describe('retrieve', () => {
    it('fetches the specified key when it exists', done => {
      const value = { foo: 'bar' }
      storage.set('a-sample-key', value, () => {
        const rule = new Rule('a-sample-key')
        rule.retrieve().then(actual => {
          assert.deepEqual(value, actual)
          storage.clear(() => done())
        })
      })
    })

    it('returns an empty object when the key does not exist', done => {
      const rule = new Rule('nonexistent_key')
      rule.retrieve().then(actual => {
        assert.deepEqual({}, actual)
        storage.clear(() => done())
      })
    })
  })
})
