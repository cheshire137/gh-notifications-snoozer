const { connect } = require('react-redux')
const React = require('react')
const ReactDOM = require('react-dom')

class FilterListItem extends React.Component {
  componentDidMount() {
    this.ensureVisible()
  }

  componentDidUpdate() {
    this.ensureVisible()
  }

  listItemClass() {
    const classes = ['filter-list-item']
    if (this.props.isFocused) {
      classes.push('focused')
    }
    return classes.join(' ')
  }

  deleteFilter() {
    this.props.dispatch({ type: 'FILTERS_REMOVE', filter: this.props.filter })
  }

  ensureVisible() {
    if (!this.props.isFocused) {
      return
    }
    const el = ReactDOM.findDOMNode(this)
    const rect = el.getBoundingClientRect()
    const isInView = rect.top >= 0 && rect.left >= 0 &&
        rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
    const nav = document.querySelector('.secondary-nav')
    const navRect = nav.getBoundingClientRect()
    const isFullyInView = isInView && rect.top >= navRect.bottom
    if (isFullyInView) {
      return
    }
    window.scrollTo(0, el.offsetTop - navRect.bottom)
  }

  render() {
    return (
      <li className={this.listItemClass()}>
        <div className="columns">
          <div className="column filter-key is-3">
            {this.props.filter.name}
          </div>
          <div className="column is-7">
            {this.props.filter.query}
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
              onClick={() => this.deleteFilter()}
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
  dispatch: React.PropTypes.func.isRequired,
  edit: React.PropTypes.func.isRequired,
  filter: React.PropTypes.object.isRequired,
  isFocused: React.PropTypes.bool.isRequired,
}

module.exports = connect()(FilterListItem)
