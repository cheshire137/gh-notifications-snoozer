const React = require('react')
const { shell } = require('electron')
const { connect } = require('react-redux')

class HiddenTaskListItem extends React.Component {
  onChange(event) {
    const { storageKey } = this.props
    const type = event.target.checked ? 'TASKS_SELECT' : 'TASKS_DESELECT'

    this.props.dispatch({ type, task: { storageKey } })
  }

  openExternal(event) {
    event.preventDefault()
    const { url } = this.props
    shell.openExternal(url)
  }

  iconClass() {
    const { state, isPullRequest } = this.props
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

  render() {
    const { updatedAt, repository, title, repositoryOwner, user, storageKey,
            url, state, repositoryOwnerAvatar, userAvatar } = this.props

    return (
      <li className="task-list-item control columns">
        <div className="column has-text-right">
          <input
            id={storageKey}
            type="checkbox"
            className="task-list-item-checkbox"
            onChange={event => this.onChange(event)}
          />
        </div>
        <div className="column has-text-centered">
          <label className="checkbox task-list-item-state-label" htmlFor={storageKey}>
            <span title={state} className={this.iconClass()}></span>
          </label>
        </div>
        <div className="column task-list-item-repository-owner-column has-text-right">
          <label className="checkbox" htmlFor={storageKey}>
            <img
              src={repositoryOwnerAvatar}
              alt={repositoryOwner}
              className="task-list-item-repository-owner-avatar"
            />
          </label>
        </div>
        <div className="is-8 column">
          <label className="checkbox main-label" htmlFor={storageKey}>
            <span className="task-list-item-title">{title}</span>
            <span className="task-list-meta">
              <span>Created </span>
              <span>by </span>
              <img
                src={userAvatar}
                alt={user}
                className="task-list-item-user-avatar"
              />
              <span> </span>
              <span className="task-list-item-user">
                {user}
              </span>
              <span> in </span>
              <span className="task-list-item-repository">
                {repository}
              </span>
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
          <a href={url} onClick={event => this.openExternal(event)}>
            <span className="octicon octicon-link-external"></span>
          </a>
        </div>
      </li>
    )
  }
}

HiddenTaskListItem.propTypes = {
  ignore: React.PropTypes.bool,
  snoozedAt: React.PropTypes.string,
  archivedAt: React.PropTypes.string,
  updatedAt: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  storageKey: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  user: React.PropTypes.string.isRequired,
  userAvatar: React.PropTypes.string.isRequired,
  userUrl: React.PropTypes.string,
  repositoryOwner: React.PropTypes.string.isRequired,
  repositoryOwnerUrl: React.PropTypes.string,
  repositoryOwnerAvatar: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  state: React.PropTypes.string.isRequired,
  repository: React.PropTypes.string.isRequired,
  isPullRequest: React.PropTypes.bool.isRequired,
}

module.exports = connect()(HiddenTaskListItem)
