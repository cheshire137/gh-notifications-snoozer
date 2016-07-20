const React = require('react')
const { connect } = require('react-redux')

class TaskList extends React.Component {
  constructor(props) {
    super(props)

    this.taskElements = props.tasks
      .filter((task) => {
        console.log(task.title);
        console.log(task.archivedAt, task.updatedAt, task.archivedAt > task.updatedAt);
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
    console.log(this.find)
  }

  render() {
    return (
      <div>
        <nav className="controls-container">
          <button type="button" className="control">snooze</button>
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

module.exports = connect(mapStateToProps)(TaskList)
