const React = require('react')
const { connect } = require('react-redux')

class Task extends React.Component {
  render() {
    const {task, onClick} = this.props

    if (!this.isVisible()) {
      return null
    }

    return (
      <li key={task.id}>
        <input type="checkbox" checked={task.selected} onClick={() => onClick(task)}/>
        <span>{task.title}</span>
      </li>
    )
  }

  isVisible() {
    const {task} = this.props

    if (task.ignore) {
      return false
    } else if (task.snooze) {
      return false
    } else if (task.archivedAt > task.updatedAt) {
      return false
    }

    return true
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (task) => {
      // WHY DOESN'T DISPATCH CALL THE REDUCER?!?
      dispatch({type: 'TASKS_SELECT', task: task})
    }
  }
}

module.exports = connect(null, mapDispatchToProps)(Task)
