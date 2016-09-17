const React = require('react')
const { connect } = require('react-redux')

const HiddenTaskListItem = require('../HiddenTaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')

class HiddenTaskList extends React.Component {
  onRestoreClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_RESTORE' })
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  navigation(tasks) {
    if (tasks.length < 1) {
      return
    }
    return (
      <nav className="controls-container has-text-right">
        <label className="label">With selected:</label>
        <button
          type="button"
          onClick={e => this.onRestoreClick(e)}
          className="control button is-link"
          id="restore-button"
          title="Restore selected"
        >↩️</button>
      </nav>
    )
  }

  emptyListMessage(tasks) {
    if (tasks.length > 0) {
      return
    }
    return (
      <p className="content">
        There are no issues or pull requests that have been snoozed, archived,
        or ignored for this filter.
      </p>
    )
  }

  isHiddenTask(task) {
    const { ignore, snoozedAt, archivedAt, updatedAt } = task

    if (ignore) {
      return true
    }

    if (typeof snoozedAt === 'string') {
      const currentDate = new Date()
      const snoozeDate = new Date(snoozedAt)
      if (this.daysBetween(snoozeDate, currentDate) < 1) {
        // Snoozed within the last day, show it
        return true
      }
    }

    if (typeof archivedAt === 'string') {
      const updateDate = new Date(updatedAt)
      const archiveDate = new Date(archivedAt)
      if (archiveDate > updateDate) {
        // Has not been updated since it was archived, show it
        return true
      }
    }

    return false
  }

  render() {
    const { activeFilter } = this.props
    const hiddenTasks = this.props.tasks.filter(task => this.isHiddenTask(task))
    return (
      <div>
        <nav id="hidden-task-list-navigation" className="top-nav nav">
          <div className="nav-left">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Hidden
              <span className="subtitle"> in &ldquo;{activeFilter}&rdquo;</span>
            </h1>
          </div>
        </nav>
        <div className="hidden-task-list-container">
          {this.navigation(hiddenTasks)}
          {this.emptyListMessage(hiddenTasks)}
          <ol className="task-list">
            {hiddenTasks.map(task =>
              <HiddenTaskListItem {...task} key={task.storageKey} />
            )}
          </ol>
        </div>
      </div>
    )
  }
}

HiddenTaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  activeFilter: React.PropTypes.string.isRequired,
}

const mapStateToProps = state => ({ tasks: state.tasks })

module.exports = connect(mapStateToProps)(hookUpStickyNav(HiddenTaskList, 'hidden-task-list-navigation'))
