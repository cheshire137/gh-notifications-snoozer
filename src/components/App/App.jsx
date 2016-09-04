const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')

const Filter = require('../../models/filter')
const Filters = require('../../models/filters')
const GitHub = require('../../models/github')
const AppMenu = require('../../models/app-menu')
const GitHubAuth = require('../../models/github-auth')

const TopNavigation = require('../TopNavigation')
const TaskList = require('../TaskList')
const FilterList = require('../FilterList')
const NewFilter = require('../NewFilter')
const EditFilter = require('../EditFilter')
const About = require('../About')
const Auth = require('../Auth')

class App extends React.Component {
  constructor() {
    super()
    this.state = { view: 'tasks', filters: Filters.findAll() }
  }

  componentDidMount() {
    ipcRenderer.send('title', 'Notifications')
    this.setupAppMenu()
    if (GitHubAuth.isAuthenticated()) {
      if (this.state.filters.length > 0) {
        this.loadFilter(this.state.filters[0])
      } else {
        this.manageFilters()
      }
      this.loadUser()
    }
  }

  setupAppMenu() {
    const menu = new AppMenu()
    menu.on('about-app', () => {
      this.showAbout()
    })
    menu.on('authenticate', () => {
      this.showAuth()
    })
  }

  showAbout() {
    ipcRenderer.send('title', 'About')
    this.setState({ view: 'about' })
  }

  showAuth() {
    ipcRenderer.send('title', 'Authenticate')
    this.setState({ view: 'auth' })
  }

  loadTasks(query) {
    const github = new GitHub()
    github.getTasks(query).then(tasks => {
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks })
    })
  }

  loadUser() {
    const github = new GitHub()
    github.getCurrentUser().then(user => {
      this.setState({ user })
    }).catch(error => {
      console.error('failed to load user', error)
      GitHubAuth.deleteToken()
    })
  }

  showNewFilterForm() {
    ipcRenderer.send('title', 'New Filter')
    this.setState({ view: 'new-filter' })
  }

  savedFilter() {
    ipcRenderer.send('title', 'Notifications')
    this.setState({ view: 'tasks', filters: Filters.findAll() })
  }

  showTaskList() {
    ipcRenderer.send('title', 'Notifications')
    this.setState({ view: 'tasks' })
  }

  loadFilter(key) {
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    const filter = new Filter(key)
    const query = filter.retrieve()
    this.loadTasks(query)
  }

  manageFilters() {
    ipcRenderer.send('title', 'Manage Filters')
    this.setState({ view: 'filters' })
  }

  deleteFilter(key) {
    const filter = new Filter(key)
    const remainingFilters = filter.delete()
    this.setState({ filters: remainingFilters })
  }

  editFilter(key) {
    const filter = new Filter(key)
    this.setState({ filter, view: 'edit-filter' })
  }

  finishedWithAuth(user) {
    if (typeof user === 'object') {
      this.setState({ user })
    }
    this.showTaskList()
  }

  render() {
    if (this.state.view === 'auth' || !GitHubAuth.isAuthenticated()) {
      return (
        <Auth
          done={user => this.finishedWithAuth(user)}
          isAuthenticated={GitHubAuth.isAuthenticated()}
          user={this.state.user}
        />
      )
    }

    if (this.state.view === 'tasks') {
      return (
        <div className="tasks-view">
          <TopNavigation
            addFilter={() => this.showNewFilterForm()}
            changeFilter={key => this.loadFilter(key)}
            manageFilters={() => this.manageFilters()}
            user={this.state.user}
            showAuth={() => this.showAuth()}
          />
          <TaskList />
        </div>
      )
    }

    if (this.state.view === 'filters') {
      return (
        <FilterList
          filters={this.state.filters}
          delete={key => this.deleteFilter(key)}
          edit={key => this.editFilter(key)}
          addFilter={() => this.showNewFilterForm()}
          cancel={() => this.showTaskList()}
        />
      )
    }

    if (this.state.view === 'edit-filter') {
      return (
        <EditFilter
          filter={this.state.filter}
          save={() => this.savedFilter()}
          addFilter={() => this.showNewFilterForm()}
          cancel={() => this.manageFilters()}
          delete={key => this.deleteFilter(key)}
        />
      )
    }

    if (this.state.view === 'about') {
      return (
        <About
          cancel={() => this.showTaskList()}
        />
      )
    }

    return (
      <NewFilter
        save={() => this.savedFilter()}
        cancel={() => this.showTaskList()}
        manageFilters={() => this.manageFilters()}
      />
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
