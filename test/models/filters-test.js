const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
const Filters = require('../../src/models/filters')

describe('Filters', () => {
  describe('findAll', () => {
    it('returns a list of saved filter names', () => {
      const names = ['mentions:cheshire137', 'involves:org/team']
      storage.set('filters', names)
      const actual = Filters.findAll()
      assert.deepEqual(names, actual)
      storage.clear()
    })

    it('returns an empty list when there are no saved filters', () => {
      const actual = Filters.findAll()
      assert(actual instanceof Array)
      assert.equal(0, actual.length)
      storage.clear()
    })
  })

  describe('addKey', () => {
    it('adds key to filters list', () => {
      const filterKeys = Filters.addKey('mentions:cat')
      // Make sure we return the correct filters list
      assert(filterKeys instanceof Array)
      assert.equal(1, filterKeys.length)
      assert.equal('mentions:cat', filterKeys[0])

      const actual = storage.get('filters')
      // Make sure what's actually stored is the correct filters list
      assert(actual instanceof Array)
      assert.equal(1, actual.length)
      assert.equal('mentions:cat', actual[0])
      storage.clear()
    })

    it('does not add duplicate key', () => {
      storage.set('filters', ['neat'])
      const filterKeys = Filters.addKey('neat')
      // Make sure we return the correct filters list
      assert(filterKeys instanceof Array)
      assert.equal(1, filterKeys.length)
      assert.equal('neat', filterKeys[0])

      const actual = storage.get('filters')
      // Make sure what's actually stored is the correct filters list
      assert(actual instanceof Array)
      assert.equal(1, actual.length)
      assert.equal('neat', actual[0])
      storage.clear()
    })
  })
})
