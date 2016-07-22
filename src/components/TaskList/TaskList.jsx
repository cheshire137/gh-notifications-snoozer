const React = require('react')
const { connect } = require('react-redux')

const Task = require('../Task')

class TaskList extends React.Component {
  render() {
    const taskElements = this.props.tasks.map(task => <Task key={task.id} task={task} />)
    return (
      <div>
        <nav className="controls-container">
          <button id="snooze" type="button" onClick={this.props.onSnoozeClick} className="control">snooze</button>
          <button type="button" className="control">ignore</button>
          <button type="button" className="control">archive</button>
        </nav>
        <ol className="issues-list">
          {taskElements}
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
      console.log("SNOOZE CLICKED");
      dispatch({type: 'TASKS_SNOOZE' })
    }
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TaskList)
