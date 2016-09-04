const React = require('react')

const Filter = require('../../models/filter')

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
              onClick={() => this.props.delete(this.props.filter)}
              type="button"
              className="button"
            >Delete</button>
          </div>
        </div>
      </li>
    )
  }
}

FilterListItem.propTypes = {
  filter: React.PropTypes.string.isRequired,
  delete: React.PropTypes.func.isRequired,
}

module.exports = FilterListItem
