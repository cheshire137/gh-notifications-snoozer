const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')

class TaskList extends React.Component {
  onSnoozeClick() {
    this.props.dispatch({ type: 'TASKS_SNOOZE' })
  }

  onArchiveClick() {
    this.props.dispatch({ type: 'TASKS_ARCHIVE' })
  }

  render() {
    return (
      <div>
        <nav className="controls-container">
          <button
            type="button"
            onClick={() => this.onSnoozeClick()}
            className="control button"
          >
            snooze
          </button>
          <button type="button" className="control button">ignore</button>
          <button
            type="button"
            className="control button"
            onClick={() => this.onArchiveClick()}
          >
            archive
          </button>
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
