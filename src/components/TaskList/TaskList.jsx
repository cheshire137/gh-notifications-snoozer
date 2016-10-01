const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')
const Filters = require('../../models/Filters')
const LastFilter = require('../../models/LastFilter')
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

  componentDidUpdate() {
    this.cachedVisibleTasks = null
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
    if (event.key === 'ArrowUp') {
      this.focusPreviousTask()
    } else if (event.key === 'ArrowDown') {
      this.focusNextTask()
    }
  }

  onKeyDown(event) {
    if (event.key === ' ' && typeof this.state.selectedIndex === 'number') {
      event.preventDefault()
      this.selectFocusedTask()
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }
  }

  changeFilter(event) {
    const filter = event.target.value
    if (filter === '') {
      return
    }
    this.props.changeFilter(filter)
  }

  editSelectedFilter() {
    this.props.editFilter(LastFilter.retrieve())
  }

  refresh(event) {
    event.currentTarget.blur() // defocus button
    const filter = document.getElementById('filters-menu').value
    this.props.changeFilter(filter)
  }

  selectFocusedTask() {
    const task = this.props.tasks[this.state.selectedIndex]
    const type = task.isSelected ? 'TASKS_DESELECT' : 'TASKS_SELECT'
    this.props.dispatch({ type, task: { storageKey: task.storageKey } })
  }

  focusNextTask() {
    const oldIndex = this.state.selectedIndex
    let newIndex = typeof oldIndex === 'number' ? oldIndex + 1 : 0
    if (newIndex > this.props.tasks.length - 1) {
      newIndex = 0
    }
    console.info('focus', this.props.tasks[newIndex].storageKey)
    this.setState({ selectedIndex: newIndex })
  }

  focusPreviousTask() {
    const oldIndex = this.state.selectedIndex
    const lastIndex = this.props.tasks.length - 1
    let newIndex = typeof oldIndex === 'number' ? oldIndex - 1 : lastIndex
    if (newIndex < 0) {
      newIndex = lastIndex
    }
    console.info('focus', this.props.tasks[newIndex].storageKey)
    this.setState({ selectedIndex: newIndex })
  }

  render() {
    const filters = Filters.findAll()
    const lastFilterKey = LastFilter.retrieve()
    const isSnoozeDisabled = this.props.tasks.
        filter(task => task.isSelected).length < 1
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
                  onChange={event => this.changeFilter(event)}
                  defaultValue={lastFilterKey}
                >
                  {filters.map(key => (
                    <option key={key} value={key}>{key}</option>
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
          <ol className="task-list">
            {this.props.tasks.map((task, index) => {
              const isFocused = index === this.state.selectedIndex
              const key = `${task.storageKey}-${task.isSelected}-${isFocused}`
              return <TaskListItem {...task} key={key} isFocused={isFocused} />
            })}
          </ol>
        </div>
      </div>
    )
  }
}

TaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  changeFilter: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
  showHidden: React.PropTypes.func.isRequired,
  editFilter: React.PropTypes.func.isRequired,
}

const stickyNavd = hookUpStickyNav(TaskList, '.task-list-navigation')
const mapStateToProps = state => ({
  tasks: state.tasks.filter(task => TaskVisibility.isVisibleTask(task)),
})
module.exports = connect(mapStateToProps)(stickyNavd)
