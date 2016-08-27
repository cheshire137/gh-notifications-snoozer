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
    }
    if (task.snooze) {
      return false
    }

    if (typeof task.archivedAt === 'string') {
      const updateDate = new Date(task.updatedAt)
      const archiveDate = new Date(task.archivedAt)
      if (archiveDate > updateDate) {
        return false
      }
    }

    return true
  }

  openExternal(event) {
    event.preventDefault()
    const { task } = this.props
    shell.openExternal(task.url)
  }

  iconClass() {
    const { task } = this.props
    const iconClasses = ['octicon']
    if (task.type === 'pull') {
      iconClasses.push('octicon-git-pull-request')
      if (task.state === 'open') {
        iconClasses.push('opened')
      } else if (task.state === 'closed') {
        iconClasses.push('closed')
      }
    } else {
      if (task.state === 'open') {
        iconClasses.push('octicon-issue-opened')
      } else if (task.state === 'closed') {
        iconClasses.push('octicon-issue-closed')
      }
    }
    return iconClasses.join(' ')
  }

  render() {
    const { task } = this.props

    if (!this.isVisible()) {
      return null
    }

    return (
      <li className="task-list-item control columns">
        <div className="column has-text-centered">
          <span title={task.state} className={this.iconClass()}></span>
        </div>
        <div className="is-8 column">
          <label className="checkbox">
            <input
              type="checkbox"
              className="task-list-item-checkbox"
              onChange={event => this.onChange(event)}
            />
            <span className="task-list-item-title">{task.title}</span>
          </label>
          <div className="task-list-item-repository">
            {task.repository}
          </div>
        </div>
        <time className="column is-2 has-text-right task-list-item-time">
          {new Date(task.updatedAt).toLocaleDateString()}
        </time>
        <div className="column has-text-right">
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
