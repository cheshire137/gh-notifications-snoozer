// 'use strict'
//
// const ElectronConfig = require('electron-config')
// const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
// const storage = new ElectronConfig({ name: configName })
// const Filter = require('./Filter')
// const LastFilter = require('./LastFilter')
// const DEFAULT_FILTER_KEY = 'default-filters'
//
// const DEFAULT_FILTERS = {
//   // All issues and PRs on the user's repositories they didn't open themselves
//   'My Repositories': 'org:login -author:login is:open sort:updated-desc',
//
//   // Open issues created by the user
//   'My Issues': 'author:login is:open sort:updated-desc type:issue',
//
//   // Open pull requests created by the user
//   'My Pull Requests': 'author:login is:open sort:updated-desc type:pr',
//
//   // Open issues and PRs the user has commented on
//   'My Comments': 'commenter:login sort:updated-desc is:open',
//
//   // Open issues and PRs the user is assigned to
//   'My Assignments': 'assignee:login sort:updated-desc is:open',
//
//   // Open issues and PRs the user is mentioned on
//   'My Mentions': 'mentions:login is:open sort:updated-desc',
//
//   // Issues and PRs the user opened that have gotten comments/reactions
//   'My Popular Items': 'author:login is:open interactions:>5 sort:updated-desc',
// }
//
// class DefaultFilters {
//   constructor(login) {
//     this.login = login
//   }
//
//   addDefaults() {
//     if (storage.has(DEFAULT_FILTER_KEY)) {
//       return
//     }
//
//     const filterNames = Object.keys(DEFAULT_FILTERS)
//     filterNames.forEach(name => {
//       const filter = new Filter(name)
//       const value = DEFAULT_FILTERS[name].replace(/login/g, this.login)
//       filter.store(value)
//     })
//
//     LastFilter.save(filterNames[0])
//     storage.set(DEFAULT_FILTER_KEY, filterNames)
//   }
// }
//
// module.exports = DefaultFilters
