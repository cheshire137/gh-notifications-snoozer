const React = require('react')
const { connect } = require('react-redux')
const { shell } = require('electron')
const GitHub = require('../../models/GitHub')
const TaskListItem = require('../TaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')
const TaskVisibility = require('../../models/TaskVisibility')

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedIndex: null }
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('keydown', this.onKeyDown)
  }

  onSnoozeClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_SNOOZE' })
  }

  onArchiveClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_ARCHIVE' })
  }

  onIgnoreClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_IGNORE' })
  }

  onKeyUp(event) {
    if (this.isFiltersMenuFocused()) {
      return
    }
    if (event.key === 'ArrowUp') {
      this.focusPreviousTask()
    } else if (event.key === 'ArrowDown') {
      this.focusNextTask()
    } else if (event.key === 'Escape') {
      this.setState({ selectedIndex: null })
    } else if (event.key === 'Enter') {
      if (typeof this.state.selectedIndex === 'number') {
        this.openLinkToFocusedTask()
      }
    }
  }

  onKeyDown(event) {
    if (this.isFiltersMenuFocused()) {
      return
    }
    if (event.key === ' ' && typeof this.state.selectedIndex === 'number') {
      event.preventDefault()
      this.selectFocusedTask()
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }
  }

  isFiltersMenuFocused() {
    return document.activeElement &&
        document.activeElement.id === 'filters-menu'
  }

  changeFilter(filterName) {
    const selectedFilter = this.props.filters.find(filter => filter.name === filterName)
    this.props.dispatch({ type: 'FILTERS_SELECT', filter: selectedFilter })
  }

  editSelectedFilter() {
    this.props.editFilter(this.props.activeFilter)
  }

  refresh(event) {
    event.currentTarget.blur() // defocus button
    const github = new GitHub()
    github.getTasks(this.props.activeFilter.query)
      .then(result => {
        const tasks = result.tasks
        const filter = this.props.activeFilter
        this.props.dispatch({ type: 'TASKS_UPDATE', filter, tasks })
      })
  }

  selectFocusedTask() {
    const task = this.props.tasks[this.state.selectedIndex]
    const type = task.isSelected ? 'TASKS_DESELECT' : 'TASKS_SELECT'
    this.props.dispatch({ type, task: { storageKey: task.storageKey } })
  }

  openLinkToFocusedTask() {
    const task = this.props.tasks[this.state.selectedIndex]
    shell.openExternal(task.url)
  }

  focusNextTask() {
    const oldIndex = this.state.selectedIndex
    let newIndex = typeof oldIndex === 'number' ? oldIndex + 1 : 0
    if (newIndex > this.props.tasks.length - 1) {
      newIndex = 0
    }
    this.focusTaskAtIndex(newIndex)
  }

  focusPreviousTask() {
    const oldIndex = this.state.selectedIndex
    const lastIndex = this.props.tasks.length - 1
    let newIndex = typeof oldIndex === 'number' ? oldIndex - 1 : lastIndex
    if (newIndex < 0) {
      newIndex = lastIndex
    }
    this.focusTaskAtIndex(newIndex)
  }

  focusTaskAtIndex(index) {
    console.info('focus task', this.props.tasks[index].storageKey)
    this.setState({ selectedIndex: index })
  }

  taskListOrMessage() {
    if (this.props.tasks.length > 0) {
      return (
        <ol className="task-list">
          {this.props.tasks.map((task, index) => {
            const isFocused = index === this.state.selectedIndex
            const key = `${task.storageKey}-${task.isSelected}-${isFocused}`
            return <TaskListItem task={task} key={key} isFocused={isFocused} />
          })}
        </ol>
      )
    }
  }

  render() {
    const isSnoozeDisabled = this.props.tasks.filter(task => task.isSelected).length < 1
    const isArchiveDisabled = isSnoozeDisabled
    const isIgnoreDisabled = isSnoozeDisabled
    return (
      <div>
        <nav className="task-list-navigation secondary-nav nav has-tertiary-nav">
          <div className="nav-left">
            <span className="nav-item compact-vertically">
              <span className="select">
                <select
                  id="filters-menu"
                  onChange={event => this.changeFilter(event.target.value)}
                  value={this.props.activeFilter ? this.props.activeFilter.name : ''}
                >
                  {this.props.filters.map(filter => (
                    <option key={filter.name} value={filter.name}>{filter.name}</option>
                  ))}
                </select>
              </span>
              <button
                onClick={e => this.refresh(e)}
                type="button"
                title="Refresh list"
                className="is-link button"
              >🔄</button>
            </span>
          </div>
          <div className="nav-right">
            <span className="nav-item compact-vertically">
              <button
                type="button"
                onClick={e => this.onSnoozeClick(e)}
                className="control button is-link"
                id="snooze-button"
                title="Snooze selected"
                disabled={isSnoozeDisabled}
              >😴 Snooze</button>
            </span>
            <span className="nav-item compact-vertically">
              <button
                type="button"
                id="archive-button"
                className="control button is-link"
                onClick={e => this.onArchiveClick(e)}
                title="Archive selected"
                disabled={isArchiveDisabled}
              >📥 Archive</button>
            </span>
            <span className="nav-item compact-vertically">
              <button
                type="button"
                className="control button is-link"
                onClick={e => this.onIgnoreClick(e)}
                title="Ignore selected"
                disabled={isIgnoreDisabled}
              >❌ Ignore</button>
            </span>
          </div>
        </nav>
        <nav className="task-list-navigation tertiary-nav nav">
          <div className="nav-left">
            <span className="nav-item compact-vertically">
              <button
                onClick={() => this.props.showHidden()}
                type="button"
                className="is-link is-small button"
                title="Show hidden tasks"
              >View hidden</button>
              <button
                onClick={() => this.editSelectedFilter()}
                type="button"
                className="is-link is-small button"
                title="Edit selected filter"
              >Edit</button>
            </span>
          </div>
        </nav>
        <div className="task-list-container">
          {this.taskListOrMessage()}
        </div>
      </div>
    )
  }
}

TaskList.propTypes = {
  activeFilter: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  editFilter: React.PropTypes.func.isRequired,
  filters: React.PropTypes.array.isRequired,
  showHidden: React.PropTypes.func.isRequired,
  tasks: React.PropTypes.array.isRequired,
}

const stickyNavd = hookUpStickyNav(TaskList, '.task-list-navigation')
const mapStateToProps = state => {
  const activeFilter = state.filters.find(filter => filter.selected)
  const tasks = state.tasks.filter(task => TaskVisibility.isVisibleTask(task, activeFilter))
  const filters = state.filters
  return { tasks, activeFilter, filters }
}

module.exports = connect(mapStateToProps)(stickyNavd)
