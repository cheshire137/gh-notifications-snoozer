const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')
const Filters = require('../../models/Filters')
const LastFilter = require('../../models/LastFilter')

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
    return (
      <div>
        <nav id="task-list-navigation" className="secondary-nav nav">
          <div className="nav-left">
            <span className="nav-item">
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
            </span>
            <span className="nav-item">
              <button
                onClick={e => this.refresh(e)}
                type="button"
                title="Refresh list"
                className="is-link button"
              ><span className="octicon octicon-sync"></span></button>
            </span>
          </div>
          <div className="nav-right">
            <span className="nav-item">
              <label className="label">With selected:</label>
            </span>
            <span className="nav-item">
              <button
                type="button"
                onClick={e => this.onSnoozeClick(e)}
                className="control button is-link"
                id="snooze-button"
                title="Snooze selected"
              >😴</button>
            </span>
            <span className="nav-item">
              <button
                type="button"
                id="archive-button"
                className="control button is-link"
                onClick={e => this.onArchiveClick(e)}
                title="Archive selected"
              >📥</button>
            </span>
            <span className="nav-item">
              <button
                type="button"
                className="control button is-link"
                onClick={e => this.onIgnoreClick(e)}
                title="Ignore selected"
              >❌</button>
            </span>
          </div>
        </nav>
        <div className="task-list-container">
          <ol className="task-list">
            {this.props.tasks.map(task =>
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
}

module.exports = connect(mapStateToProps)(hookUpStickyNav(TaskList, 'task-list-navigation'))
