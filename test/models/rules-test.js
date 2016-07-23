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
          done()
        })
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
          done()
        })
      })
    })

    it.only('returns an empty object when the key does not exist', done => {
      const rules = new Rules('nonexistent_key')
      rules.retrieve().then(actual => {
        assert.deepEqual({}, actual)
        done()
      })
    })
  })
})
