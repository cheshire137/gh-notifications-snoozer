const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig()
const Rules = require('../../src/models/rules')

describe('Rules', () => {
  describe('findAll', () => {
    it('returns a list of saved rule names', () => {
      const names = ['mentions:cheshire137', 'involves:org/team']
      storage.set('rules', names)
      const actual = Rules.findAll()
      assert.deepEqual(names, actual)
      storage.clear()
    })

    it('returns an empty list when there are no saved rules', () => {
      const actual = Rules.findAll()
      assert(actual instanceof Array)
      assert.equal(0, actual.length)
      storage.clear()
    })
  })

  describe('addKey', () => {
    it('adds key to rules list', () => {
      const ruleKeys = Rules.addKey('mentions:cat')
      // Make sure we return the correct rules list
      assert(ruleKeys instanceof Array)
      assert.equal(1, ruleKeys.length)
      assert.equal('mentions:cat', ruleKeys[0])

      const actual = storage.get('rules')
      // Make sure what's actually stored is the correct rules list
      assert(actual instanceof Array)
      assert.equal(1, actual.length)
      assert.equal('mentions:cat', actual[0])
      storage.clear()
    })

    it('does not add duplicate key', () => {
      storage.set('rules', ['neat'])
      const ruleKeys = Rules.addKey('neat')
      // Make sure we return the correct rules list
      assert(ruleKeys instanceof Array)
      assert.equal(1, ruleKeys.length)
      assert.equal('neat', ruleKeys[0])

      const actual = storage.get('rules')
      // Make sure what's actually stored is the correct rules list
      assert(actual instanceof Array)
      assert.equal(1, actual.length)
      assert.equal('neat', actual[0])
      storage.clear()
    })
  })
})
