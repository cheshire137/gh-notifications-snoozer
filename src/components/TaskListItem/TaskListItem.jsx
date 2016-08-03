const React = require('react')
const { connect } = require('react-redux')

class TaskListItem extends React.Component {
  onChange(event) {
    const { task } = this.props
    const type = event.target.checked ? 'TASKS_SELECT' : 'TASKS_DESELECT'

    this.props.dispatch({ type, task })
  }

  isVisible() {
    const { task } = this.props

    if (task.ignore) {
      return false
    } else if (task.snooze) {
      return false
    } else if (task.archivedAt > task.updatedAt) {
      return false
    }

    return true
  }

  render() {
    const { task } = this.props

    if (!this.isVisible()) {
      return null
    }

    return (
      <li>
        <input type="checkbox" onChange={event => this.onChange(event)} />
        {task.title}
        <span>&middot;</span>
        {task.updated_at}
      </li>
    )
  }
}

TaskListItem.propTypes = {
  task: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(TaskListItem)
