const React = require('react')
const FilterListItem = require('../FilterListItem')
const hookUpStickyNav = require('../hookUpStickyNav')

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
        <nav className="nav secondary-nav" id="filter-list-top-navigation">
          <div className="nav-left">
          </div>
          <div className="nav-right">
            <span className="nav-item">
              <button
                onClick={() => this.props.addFilter()}
                type="button"
                className="button is-link"
                title="Add a filter"
              >
                <span>✳️ Add Filter</span>
              </button>
            </span>
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

module.exports = hookUpStickyNav(FilterList, '#filter-list-top-navigation')
