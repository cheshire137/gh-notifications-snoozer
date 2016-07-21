const React = require('react')
const { connect } = require('react-redux')

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.onSnoozeClick = props.onSnoozeClick

    this.taskElements = props.tasks
      .filter((task) => {
        if (task.ignore) {
          return false
        } else if (task.snooze) {
          return false
        } else if (task.archivedAt > task.updatedAt) {
          return false
        } else {
          return true
        }
      })
      .map((task) => {
        return (
          <li key={task.id}>
            <input type="checkbox" />
            <span>{task.title}</span>
          </li>
        )
      })
  }

  onClick() {

  }

  render() {
    return (
      <div>
        <nav className="controls-container">
          <button id="snooze" type="button" onClick={this.onSnoozeClick} className="control">snooze</button>
          <button type="button" className="control">ignore</button>
          <button type="button" className="control">archive</button>
        </nav>
        <ol className="issues-list">
          {this.taskElements}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (tasks) => {
  return {
    tasks: tasks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSnoozeClick: (component) => {
      const selectedTasks = element.querySelector('li input[type=checkbox]')
      dispatch({{type: 'TASKS_SNOOZE', task: }})
    }
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TaskList)
