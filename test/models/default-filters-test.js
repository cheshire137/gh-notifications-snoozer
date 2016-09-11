const assert = require('assert')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const DefaultFilters = require('../../src/models/DefaultFilters')
const login = 'RupertScrivener'

describe('DefaultFilters', () => {
  describe('init', () => {
    xit('calls each filter function and then the save function', () => {
      // what is the preferred way to spy on functions?
    })
  })

  describe('myIssuesFilter', () => {
    it('creates a filter', () => {
      DefaultFilters.myIssuesFilter(login)
      const filter = storage.get('My Issues')
      assert.equal('author:RupertScrivener is:open sort:updated-desc', filter)
    })
  })

  describe('myCommentsFilter', () => {
    it('creates a filter', () => {
      DefaultFilters.myCommentsFilter(login)
      const filter = storage.get('My Comments')
      assert.equal('commenter:RupertScrivener sort:updated-desc', filter)
    })
  })

  describe('myAssignmentsFilter', () => {
    it('creates a filter', () => {
      DefaultFilters.myAssignmentsFilter(login)
      const filter = storage.get('My Assignments')
      assert.equal('assignee:RupertScrivener sort:updated-desc is:open', filter)
    })
  })

  describe('myMentionsFilter', () => {
    it('creates a filter', () => {
      DefaultFilters.myMentionsFilter(login)
      const filter = storage.get('My Mentions')
      assert.equal('mentions:RupertScrivener is:open sort:updated-desc', filter)
    })
  })

  describe('myPopularFilter', () => {
    it('creates a filter', () => {
      DefaultFilters.myPopularFilter(login)
      const filter = storage.get('My Popular Issues')
      assert.equal('author:RupertScrivener is:open interactions:>5 sort:updated-desc', filter)
    })
  })

  describe('save', () => {
    it('sets the DEFAULT_FILTER_KEY', () => {
      const DEFAULT_FILTER_KEY = 'default-filters'
      DefaultFilters.save()
      const key = storage.get(DEFAULT_FILTER_KEY)
      assert.equal('default-filters', key)
    })
  })
})
