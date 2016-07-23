const React = require('react')
const { connect } = require('react-redux')

class Task extends React.Component {
  onChange(event) {
    const { task } = this.props
    const type = event.target.checked ? 'TASKS_SELECT' : 'TASKS_UNSELECT'

    this.props.dispatch({ type, task })
  }

  isVisible() {
    const { task } = this.props

    console.log(task.archivedAt, task.updatedAt, task.archivedAt > task.updatedAt);
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
        <span>{task.title}</span>
      </li>
    )
  }
}
module.exports = connect()(Task)
