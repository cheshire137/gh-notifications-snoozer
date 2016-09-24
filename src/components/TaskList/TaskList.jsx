const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')
const Filters = require('../../models/Filters')
const LastFilter = require('../../models/LastFilter')
const TaskVisibility = require('../../models/TaskVisibility')

class TaskList extends React.Component {
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

  changeFilter(event) {
    const filter = event.target.value
    if (filter === '') {
      return
    }
    this.props.changeFilter(filter)
  }

  refresh(event) {
    event.currentTarget.blur() // defocus button
    const filter = document.getElementById('filters-menu').value
    this.props.changeFilter(filter)
  }

  render() {
    const filters = Filters.findAll()
    const lastFilterKey = LastFilter.retrieve()
    const visibleTasks = this.props.tasks.
        filter(task => TaskVisibility.isVisibleTask(task))
    const isSnoozeDisabled = visibleTasks.
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
                  <option value="">Choose a filter</option>
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
            </span>
          </div>
        </nav>
        <div className="task-list-container">
          <ol className="task-list">
            {visibleTasks.map(task =>
              <TaskListItem {...task} key={task.storageKey} />
            )}
          </ol>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ tasks: state.tasks })

TaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  changeFilter: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
  showHidden: React.PropTypes.func.isRequired,
}

module.exports = connect(mapStateToProps)(hookUpStickyNav(TaskList, '.task-list-navigation'))
