const ElectronConfig = require('electron-config')

module.exports = class DefaultFilters {
  static forLogin(login) {
    // If filters exist in the old ElectronConfig storage files use those
    const oldFilters = this.oldFilters()
    if (oldFilters) {
      return oldFilters
    }

    return [
      {
        // Open issues and PRs the user is mentioned on
        name: 'My Mentions',
        query: `mentions:${login} is:open sort:updated-desc`,
        selected: true,
      },
      {
        // All issues and PRs on the user's repositories they didn't open themselves
        name: 'My Repositories',
        query: `org:${login} -author:${login} is:open sort:updated-desc`,
      },
      {
        // Open issues created by the user
        name: 'My Issues',
        query: `author:${login} is:open sort:updated-desc type:issue`,
      },
      {
        // Open pull requests created by the user
        name: 'My Pull Requests',
        query: `author:${login} is:open sort:updated-desc type:pr`,
      },
      {
        // Open issues and PRs the user has commented on
        name: 'My Comments',
        query: `commenter:${login} sort:updated-desc is:open`,
      },
      {
        // Open issues and PRs the user is assigned to
        name: 'My Assignments',
        query: `assignee:${login} sort:updated-desc is:open`,
      },
      {
        // Issues and PRs the user opened that have gotten comments/reactions
        name: 'My Popular Items',
        query: `author:${login} is:open interactions:>5 sort:updated-desc`,
      },
    ]
  }

  static oldFilters() {
    const storage = new ElectronConfig({ name: 'config' })
    const filters = storage.get('filters')
    if (!filters) {
      return null
    }

    return filters.map(name => {
      const selected = (storage.get('last-filter') === name)
      return { name, query: storage.get('name'), selected }
    })
  }
}
