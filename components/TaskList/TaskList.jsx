const React = require('react')
const { connect } = require('react-redux')

const TaskList = ({tasks}) => {
  const taskElements = tasks
    .filter((task) => {
      return !task.ignore && !task.archive && !task.snooze
    })
    .map((task) => {
      return <li key={task.id}>{task.title}</li>
    })


  return (
    <div>
      <nav>
        <button>snooze</button>
        <button>ignore</button>
        <button>archive</button>
      </nav>
      <ol>
        {taskElements}
      </ol>
    </div>
  )
}

const mapStateToProps = (tasks) => {
  return {
    tasks: tasks
  }
}

module.exports = connect(mapStateToProps)(TaskList)
