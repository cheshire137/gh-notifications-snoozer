const React = require('react')
const { connect } = require('react-redux')

const Task = require('../Task')

class TaskList extends React.Component {
  onSnoozeClick() {
    this.props.dispatch({ type: 'TASKS_SNOOZE' })
  }

  render() {
    return (
      <div>
        <nav className="controls-container">
          <button id="snooze" type="button" onClick={() => this.onSnoozeClick()} className="control">snooze</button>
          <button type="button" className="control">ignore</button>
          <button type="button" className="control">archive</button>
        </nav>
        <ol className="issues-list">
          {this.props.tasks.map(task => {
            return (<Task key={task.id} task={task} />)
          })}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = tasks => ({ tasks })

module.exports = connect(mapStateToProps)(TaskList)
