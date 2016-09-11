'use strict'

const ElectronConfig = require('electron-config')
const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
const storage = new ElectronConfig({ name: configName })
const Filter = require('./filter')
const LastFilter = require('./last-filter')
const DEFAULT_FILTER_KEY = 'default-filters'

class DefaultFilters {
  static init(login) {
    if (!storage.has(DEFAULT_FILTER_KEY)) {
      this.myIssuesFilter(login)
      this.myCommentsFilter(login)
      this.myAssignmentsFilter(login)
      this.myMentionsFilter(login)
      this.myPopularFilter(login)
      this.save()
    }
    return
  }

  static myIssuesFilter(login) {
    const defaultFilter = new Filter('My Issues')
    defaultFilter.store(`author:${login} is:open sort:updated-desc`)
    LastFilter.save(defaultFilter.key)
  }

  static myCommentsFilter(login) {
    const defaultFilter = new Filter('My Comments')
    defaultFilter.store(`commenter:${login} sort:updated-desc`)
    LastFilter.save(defaultFilter.key)
  }

  static myAssignmentsFilter(login) {
    const defaultFilter = new Filter('My Assignments')
    defaultFilter.store(`assignee:${login} sort:updated-desc is:open`)
    LastFilter.save(defaultFilter.key)
  }

  static myMentionsFilter(login) {
    const defaultFilter = new Filter('My Mentions')
    defaultFilter.store(`mentions:${login} is:open sort:updated-desc`)
    LastFilter.save(defaultFilter.key)
  }

  static myPopularFilter(login) {
    const defaultFilter = new Filter('My Popular Issues')
    defaultFilter.store(`author:${login} is:open interactions:>5 sort:updated-desc`)
    LastFilter.save(defaultFilter.key)
  }

  static save() {
    storage.set(DEFAULT_FILTER_KEY, 'default-filters')
  }
}

module.exports = DefaultFilters
