const React = require('react')
const Filter = require('../../models/Filter')
const FilterHelp = require('../FilterHelp')
const FilterSuggester = require('../FilterSuggester')
const LastFilter = require('../../models/LastFilter')
const hookUpStickyNav = require('../hookUpStickyNav')

class NewFilter extends React.Component {
  constructor() {
    super()
    this.state = { valueHasError: false }
  }

  save(event) {
    event.preventDefault()
    const form = event.target
    const value = form.filterValue.value.trim()
    if (value.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })
    let key = form.filterKey.value.trim()
    if (key.length < 1) {
      key = value
    }
    const filter = new Filter(key)
    filter.store(value)
    LastFilter.save(key)
    this.props.loadFilter(key)
    this.props.save(key)
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    let valueClass = 'input'
    if (this.state.valueHasError) {
      valueClass += ' is-danger'
    }
    return (
      <div>
        <nav className="nav secondary-nav" id="new-filter-top-navigation">
          <div className="nav-left">
            <h2 className="subtitle nav-item">
              New Filter
            </h2>
          </div>
        </nav>
        <div className="view-container">
          <form className="new-filter-form" onSubmit={event => this.save(event)}>
            <label className="label">Search query:</label>
            <div className="control">
              <FilterSuggester className={valueClass} />
            </div>
            <label className="label">Filter name: (optional)</label>
            <p className="control">
              <input
                type="text"
                name="filterKey"
                className="input"
                placeholder="e.g., Team mentions"
              />
            </p>
            <p className="control">
              <button type="submit" className="button is-primary" id="new-filter-save">
                Save Filter
              </button>
              <button
                type="button"
                onClick={e => this.cancel(e)}
                className="button is-link"
              >Cancel</button>
            </p>
          </form>
          <FilterHelp />
        </div>
      </div>
    )
  }
}

NewFilter.propTypes = {
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  manageFilters: React.PropTypes.func.isRequired,
  loadFilter: React.PropTypes.func.isRequired,
}

module.exports = hookUpStickyNav(NewFilter, '#new-filter-top-navigation')
