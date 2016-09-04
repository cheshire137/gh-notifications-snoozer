const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const Filter = require('../../src/models/filter')

describe('Filter', () => {
  describe('store', () => {
    it('saves the given key/value pair', () => {
      const filter = new Filter('funKey')
      filter.store('glorious value')
      const actual = storage.get('funKey')
      assert.equal('glorious value', actual)
      storage.clear()
    })
  })

  describe('exists', () => {
    it('returns true when key exists', () => {
      const value = 987
      storage.set('TheBestKey', value)
      const filter = new Filter('TheBestKey')
      assert(filter.exists())
      storage.clear()
    })

    it('returns false when key does not exist', () => {
      const filter = new Filter('thebestkey')
      assert(!filter.exists())
      storage.clear()
    })
  })

  describe('retrieve', () => {
    it('fetches the specified key when it exists', () => {
      const value = { foo: 'bar' }
      storage.set('a-sample-key', value)
      const filter = new Filter('a-sample-key')
      const actual = filter.retrieve()
      assert.deepEqual(value, actual)
      storage.clear()
    })

    it('returns an empty object when the key does not exist', () => {
      const filter = new Filter('nonexistent_key')
      const actual = filter.retrieve()
      assert.deepEqual({}, actual)
      storage.clear()
    })
  })
})
