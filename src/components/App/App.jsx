const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')
const DefaultFilters = require('../../models/DefaultFilters')
const GitHub = require('../../models/GitHub')
const AppMenu = require('../../models/AppMenu')
const GitHubAuth = require('../../models/GitHubAuth')
const TabbedNav = require('../TabbedNav')
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
    this.state = {}
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
    switch (this.state.view) {
      case 'tasks': return (
        <TaskList
          showHidden={() => this.showHidden()}
          editFilter={name => this.editFilter(name)}
          loadTasks={() => this.loadTasks()}
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
      case 'about': return <About cancel={cancel} />
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

  showAbout() {
    ipcRenderer.send('title', 'About')
    this.changeView('about')
  }

  showAuth() {
    ipcRenderer.send('title', 'Authenticate')
    this.changeView('auth')
  }

  loadTasks() {
    if (!this.props.activeFilter) return

    const github = new GitHub()
    github.getNotifications().then(notifications => {
      github.getTasks(this.props.activeFilter.query).then(tasks => {
        this.props.dispatch({ type: 'TASKS_EMPTY', tasks, notifications })
        this.props.dispatch({ type: 'TASKS_UPDATE', tasks, notifications })
      }).catch(err => {
        console.error('failed to get tasks from GitHub', err)
      })
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

  showTaskList() {
    ipcRenderer.send('title', 'Tasks')
    this.changeView('tasks')
  }

  loadFilter(filter) {
    this.props.dispatch({ type: 'FILTERS_SELECT', filter })
    this.loadTasks()
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
