const assert = require('assert')
const storage = require('electron-json-storage')
const Rules = require('../../src/models/rules')

describe('Rules', () => {
  describe('store', () => {
    it('saves the given key/value pair', done => {
      const rules = new Rules('funKey')
      rules.store('glorious value').then(() => {
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
        const rules = new Rules('TheBestKey')
        rules.exists().then(hasKey => {
          assert(hasKey)
          storage.clear(() => done())
        })
      })
    })

    it('returns false when key does not exist', done => {
      const rules = new Rules('thebestkey')
      rules.exists().then(hasKey => {
        assert(!hasKey)
        storage.clear(() => done())
      })
    })
  })

  describe('retrieve', () => {
    it('fetches the specified key when it exists', done => {
      const value = { foo: 'bar' }
      storage.set('a-sample-key', value, () => {
        const rules = new Rules('a-sample-key')
        rules.retrieve().then(actual => {
          assert.deepEqual(value, actual)
          storage.clear(() => done())
        })
      })
    })

    it('returns an empty object when the key does not exist', done => {
      const rules = new Rules('nonexistent_key')
      rules.retrieve().then(actual => {
        assert.deepEqual({}, actual)
        storage.clear(() => done())
      })
    })
  })
})
