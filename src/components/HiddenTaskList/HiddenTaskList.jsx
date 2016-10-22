const React = require('react')
const { connect } = require('react-redux')

const HiddenTaskListItem = require('../HiddenTaskListItem')
const hookUpStickyNav = require('../hookUpStickyNav')
const TaskVisibility = require('../../models/TaskVisibility')

class HiddenTaskList extends React.Component {
  onRestoreClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_RESTORE' })
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  emptyListMessage() {
    if (this.props.tasks.length > 0) {
      return
    }
    return (
      <p className="content">
        There are no issues or pull requests that have been snoozed, archived,
        or ignored for this filter.
      </p>
    )
  }

  render() {
    const { activeFilter } = this.props
    const anyTaskSelected = this.props.tasks.
        filter(task => task.isSelected).length > 0
    const isRestoreDisabled = !anyTaskSelected
    if (this.props.appMenu) {
      this.props.appMenu.toggleTaskOptions(anyTaskSelected, 'restore')
    }
    return (
      <div>
        <nav id="hidden-task-list-navigation" className="secondary-nav nav">
          <div>
            <h2 className="subtitle nav-item lh">
              Hidden Tasks in &ldquo;{activeFilter}&rdquo;
            </h2>
          </div>
          {this.props.tasks.length < 1 ? '' : (
            <div className="nav-right">
              <span className="nav-item">
                <button
                  type="button"
                  onClick={e => this.onRestoreClick(e)}
                  className="control button is-link"
                  id="restore-button"
                  title="Restore selected"
                  disabled={isRestoreDisabled}
                >↩️ Restore</button>
              </span>
            </div>
          )}
        </nav>
        <div className="view-container">
          {this.emptyListMessage()}
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
  appMenu: React.PropTypes.object,
}

const stickyNavd = hookUpStickyNav(HiddenTaskList,
                                   '#hidden-task-list-navigation')
const mapStateToProps = state => ({
  tasks: state.tasks.filter(task => TaskVisibility.isHiddenTask(task)),
})
module.exports = connect(mapStateToProps)(stickyNavd)
