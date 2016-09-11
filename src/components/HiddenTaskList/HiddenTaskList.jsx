const React = require('react')
const { connect } = require('react-redux')

const HiddenTaskListItem = require('../HiddenTaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')

class HiddenTaskList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    const { activeFilter } = this.props
    return (
      <div>
        <nav id="hidden-task-list-navigation" className="top-nav nav">
          <div className="nav-left">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Hidden
              <span className="subtitle"> in &ldquo;{activeFilter}&rdquo;</span>
            </h1>
          </div>
        </nav>
        <div className="hidden-task-list-container">
          <ol className="task-list">
            {this.props.tasks.map(task =>
              <HiddenTaskListItem {...task} key={task.storageKey} />
            )}
          </ol>
        </div>
      </div>
    )
  }
}

HiddenTaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  activeFilter: React.PropTypes.string.isRequired,
}

const mapStateToProps = state => ({ tasks: state.tasks })

module.exports = connect(mapStateToProps)(hookUpStickyNav(HiddenTaskList, 'hidden-task-list-navigation'))
