const React = require('react')
const hookUpStickyNav = require('../hookUpStickyNav')

class TabbedNav extends React.Component {
  render() {
    const { active, user } = this.props
    return (
      <nav id="tabbed-nav" className="top-nav nav tabs is-toggle is-fullwidth">
        <ul>
          <li className={active === 'tasks' ? 'is-active' : ''}>
            <a id="notifications-link" onClick={this.props.showTasks}>
              <span className="tab octicon octicon-mail"></span>
              <span>Tasks</span>
            </a>
          </li>
          <li className={active === 'filters' ? 'is-active' : ''}>
            <a id="filters-link" onClick={this.props.manageFilters}>
              <span className="tab octicon octicon-beaker"></span><span>Filters</span>
            </a>
          </li>
          <li className={active === 'auth' ? 'is-active' : ''}>
            {typeof user === 'object' ? (
              <a id="auth-link" onClick={this.props.showAuth}>
                <span className="tab octicon octicon-mark-github"></span>
                <span className="user-login">{user.login}</span>
              </a>
            ) : ''}
          </li>
        </ul>
      </nav>
    )
  }
}

TabbedNav.propTypes = {
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
  showTasks: React.PropTypes.func.isRequired,
  active: React.PropTypes.string,
}

module.exports = hookUpStickyNav(TabbedNav, '#tabbed-nav')
