const React = require('react')
const hookUpStickyNav = require('../hookUpStickyNav')

class TabbedNav extends React.Component {
  render() {
    return (
      <nav id="tabbed-nav" className="top-nav nav tabs is-toggle is-fullwidth">
        <ul>
          <li className={this.props.active === 'tasks' ? 'is-active' : ''}>
            <a onClick={this.props.showTasks}>
              <span className="tab octicon octicon-mail"></span>
              <span> Notifications</span>
            </a>
          </li>
          <li className={this.props.active === 'filters' ? 'is-active' : ''}>
            <a onClick={this.props.manageFilters}>
              <span className="tab octicon octicon-beaker"></span><span> Filters</span>
            </a>
          </li>
          <li className={this.props.active === 'auth' ? 'is-active' : ''}>
            {typeof this.props.user === 'object' ? (
              <a onClick={this.props.showAuth}>
                <span className="tab octicon octicon-mark-github"></span>
                <span> {this.props.user.login}</span>
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

module.exports = hookUpStickyNav(TabbedNav, 'tabbed-nav')
