const React = require('react')

const Filter = require('../../models/Filter')

class FilterListItem extends React.Component {
  render() {
    const filter = new Filter(this.props.filter)
    return (
      <li className="filter-list-item">
        <div className="columns">
          <div className="column filter-key is-3">
            {filter.key}
          </div>
          <div className="column is-7">
            {filter.retrieve()}
          </div>
          <div className="column is-2 has-text-right">
            <button
              onClick={() => this.props.edit(this.props.filter)}
              type="button"
              className="button is-link"
              title="Edit filter"
            >
              ✏️
            </button>
            <button
              onClick={() => this.props.delete(this.props.filter)}
              type="button"
              className="button is-link"
              title="Delete filter"
            >
              ❌
            </button>
          </div>
        </div>
      </li>
    )
  }
}

FilterListItem.propTypes = {
  filter: React.PropTypes.string.isRequired,
  delete: React.PropTypes.func.isRequired,
  edit: React.PropTypes.func.isRequired,
}

module.exports = FilterListItem
