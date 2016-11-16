const React = require('react')
const ReactDOM = require('react-dom')
const { shell } = require('electron')
const { connect } = require('react-redux')

class TaskListItem extends React.Component {
  componentDidMount() {
    this.ensureVisible()
  }

  componentDidUpdate() {
    this.ensureVisible()
  }

  onToggleCheckbox() {
    const type = this.props.task.isSelected ? 'TASKS_DESELECT' : 'TASKS_SELECT'
    this.props.dispatch({ type, task: this.props.task })
  }

  ensureVisible() {
    if (!this.props.isFocused) {
      return
    }
    const el = ReactDOM.findDOMNode(this)
    const rect = el.getBoundingClientRect()
    const isInView = rect.top >= 0 && rect.left >= 0 &&
        rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
    const nav = document.querySelector('.tertiary-nav')
    const navRect = nav.getBoundingClientRect()
    const isFullyInView = isInView && rect.top >= navRect.bottom
    if (isFullyInView) {
      return
    }
    window.scrollTo(0, el.offsetTop - navRect.bottom)
  }

  openExternal(event) {
    event.preventDefault()
    this.props.dispatch({ type: 'TASKS_CLEAR_CHANGELOG', task: this.props.task })
    shell.openExternal(this.props.task.url)
  }

  iconClass() {
    const { state, isPullRequest } = this.props.task
    const iconClasses = ['octicon']
    if (isPullRequest) {
      iconClasses.push('octicon-git-pull-request')
      if (state === 'open') {
        iconClasses.push('opened')
      } else if (state === 'closed') {
        iconClasses.push('closed')
      }
    } else {
      if (state === 'open') {
        iconClasses.push('octicon-issue-opened')
      } else if (state === 'closed') {
        iconClasses.push('octicon-issue-closed')
      }
    }
    return iconClasses.join(' ')
  }

  listItemClass() {
    const listItemClasses = ['task-list-item', 'control', 'columns']
    if (this.props.isFocused) {
      listItemClasses.push('focused')
    }
    return listItemClasses.join(' ')
  }

  changes(changelog) {
    if (Object.keys(changelog || {}).length !== 0) {
      return (
        <span> –
          {changelog.comments ? ' unread comments' : null}
          {changelog.state ? ' state changed' : null}
        </span>
      )
    }
  }

  render() {
    const { updatedAt, repository, title, repositoryOwner, user, storageKey,
            url, state, repositoryOwnerAvatar, userAvatar, isSelected,
            changelog } = this.props.task

    return (
      <li className={this.listItemClass()}>
        <div className="column has-text-right">
          <input
            id={storageKey}
            type="checkbox"
            className="task-list-item-checkbox"
            defaultChecked={!!isSelected}
            onChange={() => this.onToggleCheckbox()}
          />
        </div>
        <div className="column has-text-centered">
          <label className="checkbox state-label" htmlFor={storageKey}>
            <span title={state} className={this.iconClass()}></span>
          </label>
        </div>
        <div className="column repository-owner-column has-text-right">
          <label className="checkbox" htmlFor={storageKey}>
            <img
              src={repositoryOwnerAvatar}
              alt={repositoryOwner}
              className="repository-owner-avatar"
            />
            <img
              src={userAvatar}
              alt={user}
              className="user-avatar"
            />
          </label>
        </div>
        <div className="is-8 column">
          <label className="checkbox main-label" htmlFor={storageKey}>
            <span className="task-list-item-title">{title}</span>
            <span className="task-list-meta">
              <span>Opened by </span>
              <span className="task-list-item-user">{user}</span>
              <span> in </span>
              <span className="task-list-item-repository">
                {repository}
              </span>
              {this.changes(changelog)}
            </span>
          </label>
        </div>
        <div className="column has-text-right task-list-item-time-column">
          <label className="checkbox" htmlFor={storageKey}>
            <time className="task-list-item-time">
              {new Date(updatedAt).toLocaleDateString()}
            </time>
          </label>
        </div>
        <div className="column has-text-right">
          <a
            href={url}
            onClick={event => this.openExternal(event)}
            className="open-task-list-item-link"
          ><span className="octicon octicon-link-external"></span></a>
        </div>
      </li>
    )
  }
}

TaskListItem.propTypes = {
  dispatch: React.PropTypes.func,
  task: React.PropTypes.object,
  isFocused: React.PropTypes.bool,
}

module.exports = connect()(TaskListItem)
