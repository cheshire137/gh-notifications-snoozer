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

  onChange(event) {
    const { storageKey } = this.props
    const type = event.target.checked ? 'TASKS_SELECT' : 'TASKS_DESELECT'

    this.props.dispatch({ type, task: { storageKey } })
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

  listItemClass() {
    const { isFocused } = this.props
    const listItemClasses = ['task-list-item', 'control', 'columns']
    if (isFocused) {
      listItemClasses.push('focused')
    }
    return listItemClasses.join(' ')
  }

  render() {
    const { updatedAt, repository, title, repositoryOwner, user, storageKey,
            url, state, repositoryOwnerAvatar, userAvatar } = this.props

    return (
      <li className={this.listItemClass()}>
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

TaskListItem.propTypes = {
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
  isSelected: React.PropTypes.bool,
  isFocused: React.PropTypes.bool.isRequired,
}

module.exports = connect()(TaskListItem)
