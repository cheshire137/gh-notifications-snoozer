const React = require('react')
const Filters = require('../../models/filters')

class TopNavigation extends React.Component {
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
    const rules = Filters.findAll()
    return (
      <nav className="top-navigation nav">
        <div className="nav-left">
          <span className="nav-item">
            <span className="select">
              <select id="filters-menu" onChange={event => this.changeFilter(event)}>
                <option value="">Choose a filter</option>
                {rules.map(key => (
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
    )
  }
}

TopNavigation.propTypes = {
  addFilter: React.PropTypes.func.isRequired,
  changeFilter: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
}

module.exports = TopNavigation
