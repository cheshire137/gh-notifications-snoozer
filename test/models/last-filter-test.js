const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const LastFilter = require('../../src/models/last-filter')

describe('LastFilter', () => {
  describe('save', () => {
    it('persists given value in last-filter key', () => {
      LastFilter.save('Howdy howdy howdy!')
      assert.equal('Howdy howdy howdy!', storage.get('last-filter'))
      storage.clear()
    })
  })

  describe('retrieve', () => {
    it('returns value stored in last-filter', () => {
      storage.set('last-filter', 'some-key123')
      assert.equal('some-key123', LastFilter.retrieve())
      storage.clear()
    })

    it('returns undefined when no last filter is saved', () => {
      assert.equal('undefined', typeof LastFilter.retrieve())
      storage.clear()
    })
  })
})
