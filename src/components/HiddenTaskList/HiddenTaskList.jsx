const React = require('react')
const hookUpStickyNav = require('../hookUpStickyNav')

class HiddenTaskList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    return (
      <div>
        <nav id="hidden-task-list-navigation" className="top-nav nav">
          <div className="nav-left">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Hidden Tasks
            </h1>
          </div>
        </nav>
        <div className="hidden-task-list-container">
        </div>
      </div>
    )
  }
}

HiddenTaskList.propTypes = {
  cancel: React.PropTypes.func.isRequired,
}

module.exports = hookUpStickyNav(HiddenTaskList, 'hidden-task-list-navigation')
