const React = require('react')
const FilterListItem = require('../FilterListItem')
const hookUpStickyNav = require('../hook-up-sticky-nav')

class FilterList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  filterListOrMessage() {
    if (this.props.filters.length < 1) {
      return (
        <p>
          You have not added any filters yet. Use filters to manage which
          issues and pull requests are displayed.
        </p>
      )
    }
    return (
      <ul className="filter-list">
        {this.props.filters.map(key => (
          <FilterListItem
            key={key}
            filter={key}
            delete={this.props.delete}
            edit={this.props.edit}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div>
        <nav className="nav top-nav" id="filter-list-top-navigation">
          <div className="nav-left">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Manage Filters
            </h1>
          </div>
          <div className="nav-right">
            <button
              onClick={this.props.addFilter}
              type="button"
              className="button is-link"
              title="Add a filter"
            ><span className="octicon octicon-plus"></span></button>
          </div>
        </nav>
        <div className="filter-list-container">
          {this.filterListOrMessage()}
        </div>
      </div>
    )
  }
}

FilterList.propTypes = {
  filters: React.PropTypes.array.isRequired,
  delete: React.PropTypes.func.isRequired,
  edit: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = hookUpStickyNav(FilterList, 'filter-list-top-navigation')
