const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const DefaultFilters = require('../../src/models/DefaultFilters')
const DEFAULT_FILTER_KEY = 'default-filters'
const login = 'RupertScrivener'

describe('DefaultFilters', () => {
  describe('addDefaults', () => {
    beforeEach(() => {
      storage.clear()
      const filters = new DefaultFilters(login)
      filters.addDefaults()
    })

    it('creates the default filters', () => {
      assert(storage.has('My Repositories'))
      assert(storage.has('My Issues'))
      assert(storage.has('My Pull Requests'))
      assert(storage.has('My Comments'))
      assert(storage.has('My Assignments'))
      assert(storage.has('My Mentions'))
      assert(storage.has('My Popular Items'))
    })

    it('saves the list of filter names in DEFAULT_FILTER_KEY', () => {
      assert(storage.has(DEFAULT_FILTER_KEY))
      assert.deepEqual(['My Repositories', 'My Issues', 'My Pull Requests',
                        'My Comments', 'My Assignments', 'My Mentions',
                        'My Popular Items'], storage.get(DEFAULT_FILTER_KEY))
    })

    it('has correct value for My Issues', () => {
      const filter = storage.get('My Issues')
      assert.equal('author:RupertScrivener is:open sort:updated-desc ' +
                   'type:issue', filter)
    })

    it('has correct value for My Pull Requests', () => {
      const filter = storage.get('My Pull Requests')
      assert.equal('author:RupertScrivener is:open sort:updated-desc type:pr', filter)
    })

    it('has correct value for My Comments', () => {
      const filter = storage.get('My Comments')
      assert.equal('commenter:RupertScrivener sort:updated-desc is:open',
                   filter)
    })

    it('has correct value for My Repositories', () => {
      const filter = storage.get('My Repositories')
      assert.equal('org:RupertScrivener -author:RupertScrivener is:open ' +
                   'sort:updated-desc', filter)
    })

    it('has correct value for My Assignments', () => {
      const filter = storage.get('My Assignments')
      assert.equal('assignee:RupertScrivener sort:updated-desc is:open', filter)
    })

    it('has correct value for My Mentions', () => {
      const filter = storage.get('My Mentions')
      assert.equal('mentions:RupertScrivener is:open sort:updated-desc', filter)
    })

    it('has correct value for My Popular Items', () => {
      const filter = storage.get('My Popular Items')
      assert.equal('author:RupertScrivener is:open interactions:>5 ' +
                   'sort:updated-desc', filter)
    })
  })
})
