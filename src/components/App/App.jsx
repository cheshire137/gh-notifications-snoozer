const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')
const Filter = require('../../models/Filter')
const Filters = require('../../models/Filters')
const GitHub = require('../../models/GitHub')
const AppMenu = require('../../models/AppMenu')
const GitHubAuth = require('../../models/GitHubAuth')
const LastFilter = require('../../models/LastFilter')
const TabbedNav = require('../TabbedNav')
const DefaultFilters = require('../../models/DefaultFilters')
const TaskList = require('../TaskList')
const FilterList = require('../FilterList')
const NewFilter = require('../NewFilter')
const EditFilter = require('../EditFilter')
const About = require('../About')
const Auth = require('../Auth')
const HiddenTaskList = require('../HiddenTaskList')

class App extends React.Component {
  constructor() {
    super()
    const view = GitHubAuth.isAuthenticated() ? 'tasks' : 'auth'
    this.state = {
      view,
      filters: Filters.findAll(),
      filter: LastFilter.retrieve(),
    }
  }

  componentDidMount() {
    ipcRenderer.send('title', 'Tasks')
    this.setupAppMenu()
    if (GitHubAuth.isAuthenticated()) {
      this.loadUser()
      if (this.state.filter) {
        this.loadFilter(this.state.filter)
      } else {
        this.manageFilters()
      }
    }
  }

  onNotificationsFetched(notifications, query) {
    this.setState({ notifications }, () => {
      this.getTasksAfterNotifications(query)
    })
  }

  onUserLoad(user) {
    if (user) {
      const filters = new DefaultFilters(user.login)
      filters.addDefaults()
    }
    this.setState({ user, filters: Filters.findAll() })
  }

  getTasksAfterNotifications(query) {
    const github = new GitHub()
    github.getTasks(query).then(result => {
      const { tasks, nextUrl, currentUrl } = result
      this.setState({ urls: [currentUrl, nextUrl], currentUrlIndex: 0 })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
    }).catch(err => {
      console.error('failed to get tasks from GitHub', query, err)
    })
  }

  setupAppMenu() {
    this.appMenu = new AppMenu({
      isAuthenticated: GitHubAuth.isAuthenticated(),
    })
    this.appMenu.on('about-app', () => {
      this.showAbout()
    })
    this.appMenu.on('authenticate', () => {
      this.showAuth()
    })
    this.appMenu.on('tasks', () => {
      if (GitHubAuth.isAuthenticated()) {
        this.showTaskList()
      }
    })
    this.appMenu.on('filters', () => {
      if (GitHubAuth.isAuthenticated()) {
        this.manageFilters()
      }
    })
  }

  getViewContents() {
    let cancel = () => this.showTaskList()
    if (this.state.previousView === 'filters') {
      cancel = () => this.manageFilters()
    }
    const addFilter = () => this.showNewFilterForm()
    const editFilter = key => this.editFilter(key)
    const save = key => this.savedFilter(key)
    const manageFilters = () => this.manageFilters()
    const loadFilter = key => this.loadFilter(key)
    let loadNextPage = null
    if (this.state.urls &&
        this.state.currentUrlIndex < this.state.urls.length - 1) {
      loadNextPage = () => this.loadNextPage()
    }
    let loadPrevPage = null
    if (this.state.currentUrlIndex > 0) {
      loadPrevPage = () => this.loadPrevPage()
    }
    let currentPage = null
    if (typeof this.state.currentUrlIndex === 'number') {
      currentPage = this.state.currentUrlIndex + 1
    }
    switch (this.state.view) {
      case 'tasks': return (
        <TaskList
          addFilter={addFilter}
          changeFilter={loadFilter}
          manageFilters={manageFilters}
          user={this.state.user}
          showAuth={() => this.showAuth()}
          showHidden={() => this.showHidden()}
          editFilter={editFilter}
          loadNextPage={loadNextPage}
          loadPrevPage={loadPrevPage}
          currentPage={currentPage}
        />)
      case 'filters': return (
        <FilterList
          filters={this.state.filters}
          delete={key => this.deleteFilter(key)}
          edit={editFilter}
          addFilter={addFilter}
          cancel={cancel}
        />)
      case 'edit-filter': return (
        <EditFilter
          filter={this.state.filter}
          save={save}
          addFilter={addFilter}
          cancel={cancel}
          delete={key => this.deleteFilter(key)}
        />)
      case 'about': return <About cancel={cancel} />
      case 'new-filter': return (
        <NewFilter
          save={save}
          cancel={cancel}
          manageFilters={manageFilters}
          loadFilter={loadFilter}
        />)
      case 'hidden': return (
        <HiddenTaskList
          cancel={cancel}
          activeFilter={this.state.filter}
        />)
      default: return (
        <Auth
          done={user => this.finishedWithAuth(user)}
          isAuthenticated={GitHubAuth.isAuthenticated()}
          user={this.state.user}
        />
      )
    }
  }

  loadNextPage() {
    if (!this.state.urls) {
      return
    }
    const github = new GitHub()
    const url = this.state.urls[this.state.urls.length - 1]
    github.getTasksFromUrl(url).then(result => {
      const { tasks, nextUrl } = result
      const urls = this.state.urls.concat([nextUrl])
      this.setState({ urls, currentUrlIndex: urls.indexOf(url) })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
      window.scrollTo(0, 0)
    }).catch(err => {
      console.error('failed to get next page of tasks from GitHub',
                    this.state.urls, err)
    })
  }

  loadPrevPage() {
    if (!this.state.urls) {
      return
    }
    const github = new GitHub()
    const url = this.state.urls[this.state.urls.length - 2]
    github.getTasksFromUrl(url).then(result => {
      const { tasks } = result
      const urls = this.state.urls.slice(0, this.state.urls.length - 1)
      this.setState({ urls, currentUrlIndex: urls.indexOf(url) - 1 })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
      window.scrollTo(0, 0)
    }).catch(err => {
      console.error('failed to get previous page of tasks from GitHub',
                    this.state.urls, err)
    })
  }

  showAbout() {
    ipcRenderer.send('title', 'About')
    this.changeView('about')
  }

  showAuth() {
    ipcRenderer.send('title', 'Authenticate')
    this.changeView('auth')
  }

  loadTasks(query) {
    const github = new GitHub()
    if (this.state.notifications) {
      this.getTasksAfterNotifications(query)
      return
    }
    github.getNotifications().then(notifications => {
      this.onNotificationsFetched(notifications, query)
    }).catch(err => {
      console.error('failed to get notifications from GitHub', err)
    })
  }

  loadUser() {
    const github = new GitHub()
    github.getCurrentUser().then(user => this.onUserLoad(user))
          .catch(error => {
            console.error('failed to load user', error)
            GitHubAuth.deleteToken()
          })
  }

  showNewFilterForm() {
    ipcRenderer.send('title', 'New Filter')
    this.changeView('new-filter')
  }

  savedFilter(key) {
    ipcRenderer.send('title', 'Tasks')
    this.setState({ filters: Filters.findAll() }, () => {
      this.changeView('tasks')
      this.loadFilter(key)
    })
  }

  showTaskList() {
    ipcRenderer.send('title', 'Tasks')
    this.changeView('tasks')
  }

  loadFilter(key) {
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    LastFilter.save(key)
    const filter = new Filter(key)
    this.setState({ filter: key, nextUrl: null })
    const query = filter.retrieve()
    this.loadTasks(query)
  }

  manageFilters() {
    ipcRenderer.send('title', 'Manage Filters')
    this.changeView('filters')
  }

  deleteFilter(key) {
    const filter = new Filter(key)
    const remainingFilters = filter.delete()
    this.setState({ filters: remainingFilters })
  }

  showHidden() {
    ipcRenderer.send('title', 'Hidden Tasks')
    this.changeView('hidden')
  }

  editFilter(key) {
    this.setState({ filter: key }, () => {
      ipcRenderer.send('title', `Edit Filter ${key}`)
      this.changeView('edit-filter')
    })
  }

  changeView(view) {
    window.scrollTo(0, 0)
    this.setState({ view, previousView: this.state.view })
  }

  finishedWithAuth(user) {
    this.onUserLoad(user)
    if (user) {
      this.showTaskList()
    }
    this.appMenu.setIsAuthenticated(typeof user === 'object')
  }

  render() {
    return (
      <div>
        <TabbedNav
          manageFilters={() => this.manageFilters()}
          user={this.state.user}
          showAuth={() => this.showAuth()}
          showTasks={() => this.showTaskList()}
          active={this.state.view}
          isAuthenticated={GitHubAuth.isAuthenticated()}
        />
        {this.getViewContents()}
      </div>)
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
