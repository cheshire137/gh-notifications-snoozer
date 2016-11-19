const { connect } = require('react-redux')
const React = require('react')
const HelperActions = require('../../models/HelperActions')
const FilterSuggester = require('../FilterSuggester')
const hookUpStickyNav = require('../hookUpStickyNav')

class EditFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { valueHasError: false }
  }

  save(event) {
    event.preventDefault()
    if (this.props.filter.query.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })
    HelperActions.updateFilter(this.props.dispatch, this.props.filter)
    this.props.showtasks()
  }

  cancel(event) {
    event.preventDefault()
    this.props.showtasks()
  }

  render() {
    const { filter } = this.props
    let valueClass = 'input'
    if (this.state.valueHasError) {
      valueClass += ' is-danger'
    }
    return (
      <div>
        <nav className="nav secondary-nav" id="edit-filter-top-navigation">
          <div className="nav-left">
            <h2 className="subtitle nav-item">
              Edit Filter
            </h2>
          </div>
        </nav>
        <div className="view-container">
          <form className="edit-filter-form" onSubmit={event => this.save(event)}>
            <label className="label">Filter name: (optional)</label>
            <p className="control">
              <input
                type="text"
                name="filterKey"
                className="input"
                value={filter.name}
                onChange={event => (filter.key = event.target.value)}
                placeholder="e.g., Team mentions"
                autoFocus="autofocus"
              />
            </p>
            <label className="label">Search query:</label>
            <div className="control">
              <FilterSuggester
                className={valueClass}
                value={filter.query}
                onChange={val => (filter.query = val)}
                inputID="edit-filter-query"
              />
            </div>
            <p className="control">
              <button type="submit" className="button is-primary">
                Save Filter
              </button>
              <button
                type="button"
                onClick={e => this.cancel(e)}
                className="button is-link"
              >Cancel</button>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

EditFilter.propTypes = {
  filter: React.PropTypes.object.isRequired,
  showtasks: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}

const stickyNav = hookUpStickyNav(EditFilter, '#edit-filter-top-navigation')
module.exports = connect()(stickyNav)
