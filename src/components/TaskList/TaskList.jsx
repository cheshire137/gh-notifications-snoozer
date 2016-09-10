const React = require('react')
const { connect } = require('react-redux')

const TaskListItem = require('../TaskListItem')
const hookUpStickyNav = require('../hook-up-sticky-nav')
const Filters = require('../../models/filters')

class TaskList extends React.Component {
  onSnoozeClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_SNOOZE' })
  }

  onArchiveClick(event) {
    event.currentTarget.blur() // defocus button
    this.props.dispatch({ type: 'TASKS_ARCHIVE' })
  }

  changeFilter(event) {
    const filter = event.target.value
    if (filter === '') {
      return
    }
    this.props.changeFilter(filter)
  }

  refresh(event) {
    event.currentTarget.blur() // defocus button
    const filter = document.getElementById('filters-menu').value
    this.props.changeFilter(filter)
  }

  render() {
    const filters = Filters.findAll()
    return (
      <div>
        <nav id="task-list-navigation" className="top-nav nav">
          <div className="nav-left">
            <span className="nav-item">
              <span className="select">
                <select id="filters-menu" onChange={event => this.changeFilter(event)}>
                  <option value="">Choose a filter</option>
                  {filters.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </span>
            </span>
            <span className="nav-item">
              <button
                onClick={e => this.refresh(e)}
                type="button"
                title="Refresh list"
                className="is-link button"
              ><span className="octicon octicon-sync"></span></button>
            </span>
          </div>

          <div className="nav-right">
            {typeof this.props.user === 'object' ? (
              <span className="nav-item">
                <button
                  onClick={this.props.showAuth}
                  type="button"
                  className="is-link button"
                  title="Authenticate"
                >{this.props.user.login}</button>
              </span>
            ) : ''}
            <span className="nav-item">
              <button
                onClick={this.props.manageFilters}
                type="button"
                className="is-link button"
                title="Manage filters"
              ><span className="octicon octicon-three-bars"></span></button>
              <button
                onClick={this.props.addFilter}
                type="button"
                className="is-link button"
                title="Add a filter"
              ><span className="octicon octicon-plus"></span></button>
            </span>
          </div>
        </nav>
        <div className="task-list-container">
          <nav className="controls-container has-text-right">
            <label className="label">With selected:</label>
            <button
              type="button"
              onClick={e => this.onSnoozeClick(e)}
              className="control button is-link"
              title="Snooze selected"
            >😴</button>
            <button
              type="button"
              className="control button is-link"
              onClick={e => this.onArchiveClick(e)}
              title="Archive selected"
            >📥</button>
            <button
              type="button"
              className="control button is-link"
              title="Ignore selected"
            >❌</button>
          </nav>
          <ol className="task-list">
            {this.props.tasks.map(task =>
              <TaskListItem {...task} key={task.storageKey} />
            )}
          </ol>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ tasks: state.tasks })

TaskList.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  changeFilter: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
}

module.exports = connect(mapStateToProps)(hookUpStickyNav(TaskList, 'task-list-navigation'))
