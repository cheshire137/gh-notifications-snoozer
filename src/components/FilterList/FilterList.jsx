const React = require('react')
const FilterListItem = require('../FilterListItem')

class FilterList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    return (
      <div className="filter-list-container">
        <div className="columns filter-list-top-navigation">
          <div className="column is-7">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Manage Filters
            </h1>
          </div>
          <div className="column is-5 has-text-right">
            <button
              onClick={this.props.addFilter}
              type="button"
              className="button is-link"
              title="Add a filter"
            ><span className="octicon octicon-plus"></span></button>
          </div>
        </div>
        {this.props.filters.length < 1 ? (
          <p>
            You have not added any filters yet. Use filters to manage which
            issues and pull requests are displayed.
          </p>
        ) : (
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
        )}
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

module.exports = FilterList
