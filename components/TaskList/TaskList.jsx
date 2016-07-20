const React = require('react')
const { connect } = require('react-redux')

class TaskList extends React.Component {
  constructor(props) {
    super(props)

    this.taskElements = props.tasks
      .filter((task) => {
        if (task.ignore) {
          return false
        } else if (task.snooze) {
          return false
        } else if (task.archivedAt >= task.updatedAt) {
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
        <nav>
          <button id="snooze" onClick={event => this.onClick(event)}>snooze</button>
          <button>ignore</button>
          <button>archive</button>
        </nav>
        <ol>
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
