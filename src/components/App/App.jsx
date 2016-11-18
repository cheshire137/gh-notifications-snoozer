const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')
const GitHub = require('../../models/GitHub')
const AppMenu = require('../../models/AppMenu')
const GitHubAuth = require('../../models/GitHubAuth')
const HelperActions = require('../../models/HelperActions')
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
  constructor(props) {
    super(props)
    this.state = { }
  }

  componentWillMount() {
    if (GitHubAuth.isAuthenticated()) {
      this.showTaskList()
    } else {
      this.showAuth()
    }
  }

  componentDidMount() {
    this.updateTasksInBackground()

    ipcRenderer.send('title', 'Tasks')
    this.setupAppMenu()
    if (GitHubAuth.isAuthenticated()) {
      this.loadUser()
    }
  }

  onUserLoad(user) {
    if (this.props.filters.length === 0) {
      DefaultFilters.forLogin(user.login).forEach(filter => {
        HelperActions.updateFilter(this.props.dispatch, filter)
      })
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

  updateTasksInBackground() {
    if (!GitHubAuth.isAuthenticated()) return

    let promise = Promise.resolve()
    this.props.filters.forEach(filter => {
      promise = promise.then(() => {
        return HelperActions.updateTasks(this.props.dispatch, filter)
      })
    })

    return promise.then(() => {
      const secondsBetweenPolling = 60
      setTimeout(() => this.updateTasksInBackground(), secondsBetweenPolling * 1000)
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

const mapStateToProps = state => {
  const props = {
    filters: state.filters,
    activeFilter: state.filters.find(filter => filter.selected)
  }
  return props
}
module.exports = connect(mapStateToProps)(App)
