const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
const Rule = require('../../src/models/rule')

describe('Rule', () => {
  describe('store', () => {
    it('saves the given key/value pair', () => {
      const rule = new Rule('funKey')
      rule.store('glorious value')
      const actual = storage.get('funKey')
      assert.equal('glorious value', actual)
      storage.clear()
    })
  })

  describe('exists', () => {
    it('returns true when key exists', () => {
      const value = 987
      storage.set('TheBestKey', value)
      const rule = new Rule('TheBestKey')
      assert(rule.exists())
      storage.clear()
    })

    it('returns false when key does not exist', () => {
      const rule = new Rule('thebestkey')
      assert(!rule.exists())
      storage.clear()
    })
  })

  describe('retrieve', () => {
    it('fetches the specified key when it exists', () => {
      const value = { foo: 'bar' }
      storage.set('a-sample-key', value)
      const rule = new Rule('a-sample-key')
      const actual = rule.retrieve()
      assert.deepEqual(value, actual)
      storage.clear()
    })

    it('returns an empty object when the key does not exist', () => {
      const rule = new Rule('nonexistent_key')
      const actual = rule.retrieve()
      assert.deepEqual({}, actual)
      storage.clear()
    })
  })
})
