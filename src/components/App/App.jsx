const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')
const GitHub = require('../../models/GitHub')
const AppMenu = require('../../models/AppMenu')
const GitHubAuth = require('../../models/GitHubAuth')
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
    this.state = { loadingTasks: true }
  }

  componentWillMount() {
    if (GitHubAuth.isAuthenticated()) {
      this.showTaskList()
    } else {
      this.showAuth()
    }
  }

  componentDidMount() {
    ipcRenderer.send('title', 'Tasks')
    this.setupAppMenu()
    if (GitHubAuth.isAuthenticated()) {
      this.loadUser()
      this.loadTasks()
    }
  }

  onUserLoad(user) {
    if (this.props.filters.length === 0) {
      DefaultFilters.forLogin(user.login).forEach(filter => {
        this.props.dispatch({ type: 'FILTERS_UPDATE', filter })
      })
      this.loadTasks()
    }
    this.setState({ user })
  }

  getTasksAfterNotifications() {
    const github = new GitHub()
    github.getTasks(this.props.activeFilter).then(result => {
      const { tasks, nextUrl, currentUrl } = result
      const urls = [currentUrl]
      if (nextUrl) {
        urls.push(nextUrl)
      }
      this.setState({ urls, currentUrlIndex: 0, loadingTasks: false })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
    }).catch(err => {
      console.error('failed to get tasks from GitHub', this.props.activeFilter,
                    err)
      this.setState({ loadingTasks: false })
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
          showHidden={() => this.showHidden()}
          editFilter={name => this.editFilter(name)}
          loadTasks={() => this.loadTasks()}
          loadNextPage={loadNextPage}
          loadPrevPage={loadPrevPage}
          currentPage={currentPage}
          loading={this.state.loadingTasks}
        />)
      case 'filters': return (
        <FilterList
          edit={name => this.editFilter(name)}
          addFilter={() => this.showNewFilterForm()}
          cancel={cancel}
        />)
      case 'edit-filter': return (
        <EditFilter
          filter={this.props.activeFilter}
          showtasks={cancel}
        />)
      case 'about': return <About />
      case 'new-filter': return (
        <NewFilter
          cancel={cancel}
          manageFilters={() => this.manageFilters()}
          loadFilter={name => this.loadFilter(name)}
        />)
      case 'hidden': return (
        <HiddenTaskList
          cancel={cancel}
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
    if (!this.state.urls || this.state.urls.length < 1) {
      return
    }
    this.setState({ loadingTasks: true })
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    const github = new GitHub()
    const url = this.state.urls[this.state.urls.length - 1]
    github.getTasksFromUrl(url).then(result => {
      const { tasks, nextUrl } = result
      let urls = this.state.urls
      if (nextUrl) {
        urls = urls.concat([nextUrl])
      }
      this.setState({ urls, currentUrlIndex: urls.indexOf(url),
                      loadingTasks: false })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
      window.scrollTo(0, 0)
    }).catch(err => {
      console.error('failed to get next page of tasks from GitHub',
                    this.state.urls, err)
      this.setState({ loadingTasks: false })
    })
  }

  loadPrevPage() {
    if (!this.state.urls || this.state.urls.length < 1) {
      return
    }
    this.setState({ loadingTasks: true })
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    const github = new GitHub()
    const url = this.state.urls[this.state.urls.length - 2]
    github.getTasksFromUrl(url).then(result => {
      const { tasks } = result
      const urls = this.state.urls.slice(0, this.state.urls.length - 1)
      this.setState({ urls, currentUrlIndex: this.state.currentUrlIndex - 1,
                      loadingTasks: false })
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks,
                            notifications: this.state.notifications })
      window.scrollTo(0, 0)
    }).catch(err => {
      console.error('failed to get previous page of tasks from GitHub',
                    this.state.urls, err)
      this.setState({ loadingTasks: false })
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

  loadTasks() {
    if (!this.props.activeFilter) {
      return
    }

    this.props.dispatch({ type: 'TASKS_EMPTY' })

    const github = new GitHub()
    if (this.state.notifications) {
      this.getTasksAfterNotifications()
      return
    }
    github.getNotifications().then(notifications => {
      this.setState({ notifications }, () => {
        this.getTasksAfterNotifications()
      })
    }).catch(err => {
      console.error('failed to get notifications from GitHub', err)
      this.setState({ loadingTasks: false })
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

  showTaskList() {
    ipcRenderer.send('title', 'Tasks')
    this.changeView('tasks')
  }

  loadFilter(filter) {
    this.props.dispatch({ type: 'FILTERS_SELECT', filter })
    this.loadTasks()
    this.setState({ urls: null, currentUrlIndex: null, loadingTasks: true })
  }

  manageFilters() {
    ipcRenderer.send('title', 'Manage Filters')
    this.changeView('filters')
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
  activeFilter: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  filters: React.PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  filters: state.filters,
  activeFilter: state.filters.find(filter => filter.selected),
})
module.exports = connect(mapStateToProps)(App)
