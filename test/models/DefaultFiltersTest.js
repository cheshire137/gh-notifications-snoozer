const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const DefaultFilters = require('../../src/models/DefaultFilters')
const DEFAULT_FILTER_KEY = 'default-filters'
const login = 'RupertScrivener'

describe('DefaultFilters', () => {
  describe('init', () => {
    beforeEach(() => {
      const filters = new DefaultFilters(login)
      filters.addDefaults()
    })

    it('creates the default filters', () => {
      assert.equal(true, storage.has('My Issues'))
      assert.equal(true, storage.has('My Comments'))
      assert.equal(true, storage.has('My Assignments'))
      assert.equal(true, storage.has('My Mentions'))
      assert.equal(true, storage.has('My Popular Issues'))
    })

    it('saves the DEFAULT_FILTER_KEY', () => {
      assert.equal(true, storage.has(DEFAULT_FILTER_KEY))
    })

    it('has correct value for My Issues', () => {
      const filter = storage.get('My Issues')
      assert.equal('author:RupertScrivener is:open sort:updated-desc', filter)
    })

    it('has correct value for My Comments', () => {
      const filter = storage.get('My Comments')
      assert.equal('commenter:RupertScrivener sort:updated-desc', filter)
    })

    it('has correct value for My Assignments', () => {
      const filter = storage.get('My Assignments')
      assert.equal('assignee:RupertScrivener sort:updated-desc is:open', filter)
    })

    it('has correct value for My Mentions', () => {
      const filter = storage.get('My Mentions')
      assert.equal('mentions:RupertScrivener is:open sort:updated-desc', filter)
    })

    it('has correct value for My Popular Issues', () => {
      const filter = storage.get('My Popular Issues')
      assert.equal('author:RupertScrivener is:open interactions:>5 sort:updated-desc', filter)
    })
  })
})
