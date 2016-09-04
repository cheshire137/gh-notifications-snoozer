const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')

class TaskList extends React.Component {
  onSnoozeClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_SNOOZE' })
  }

  onArchiveClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_ARCHIVE' })
  }

  render() {
    return (
      <div>
        <nav className="controls-container has-text-right">
          <label className="label">With selected:</label>
          <button
            type="button"
            onClick={e => this.onSnoozeClick(e)}
            className="control button is-link"
            title="Snooze selected"
          >😴</button>
          <button
            type="button"
            className="control button is-link"
            onClick={e => this.onArchiveClick(e)}
            title="Archive selected"
          >📥</button>
          <button
            type="button"
            className="control button is-link"
            title="Ignore selected"
          >❌</button>
        </nav>
        <ol className="task-list">
          {this.props.tasks.map(task =>
            <TaskListItem task={task} key={task.id} />
          )}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = state => ({ tasks: state.tasks })

TaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect(mapStateToProps)(TaskList)
