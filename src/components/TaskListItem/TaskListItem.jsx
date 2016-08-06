const React = require('react')
const shell = require('electron').shell
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

  openExternal(event) {
    event.preventDefault()
    const { task } = this.props
    shell.openExternal(task.url)
  }

  render() {
    const { task } = this.props

    if (!this.isVisible()) {
      return null
    }

    return (
      <li className="task-list-item control columns">
        <label className="checkbox column">
          <input type="checkbox" onChange={event => this.onChange(event)} />
          <span className="task-list-item-title">{task.title}</span>
          <span className="separator">&middot;</span>
          <time className="task-list-item-time">
            {task.updatedAt.toLocaleDateString()}
          </time>
        </label>
        <div className="column is-one-third has-text-right">
          <a href={task.url} onClick={event => this.openExternal(event)}>
            <span className="octicon octicon-link-external"></span>
          </a>
        </div>
      </li>
    )
  }
}

TaskListItem.propTypes = {
  task: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(TaskListItem)
