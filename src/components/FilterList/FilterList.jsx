const React = require('react')
const FilterListItem = require('../FilterListItem')

class FilterList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    return (
      <div>
        <div className="columns">
          <div className="column is-6">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Manage Filters
            </h1>
          </div>
          <div className="column is-6 has-text-right">
            <button
              onClick={this.props.addFilter}
              type="button"
              className="button"
            >Add a filter</button>
          </div>
        </div>
        {this.props.filters.length < 1 ? (
          <p>You have not made any filters for managing notifications yet.</p>
        ) : (
          <ul className="filter-list">
            {this.props.filters.map(key => (
              <FilterListItem
                key={key}
                filter={key}
                delete={this.props.delete}
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
  addFilter: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = FilterList
