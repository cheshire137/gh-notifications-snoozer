const { connect } = require('react-redux')
const React = require('react')
const FilterSuggester = require('../FilterSuggester')
const hookUpStickyNav = require('../hookUpStickyNav')

class NewFilter extends React.Component {
  constructor() {
    super()
    this.state = { valueHasError: false }
  }

  save(event) {
    event.preventDefault()
    const form = event.target
    const query = form.filterValue.value.trim()
    if (query.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })

    let name = form.filterKey.value.trim()
    if (name.length < 1) {
      name = query
    }

    const filter = { name, query }
    this.props.dispatch({ type: 'FILTERS_UPDATE', filter })
    this.props.dispatch({ type: 'FILTERS_SELECT', filter })
    this.props.cancel() // Not really canceled, it will force the task list to show
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
          <form
            className="new-filter-form"
            onSubmit={event => this.save(event)}
          >
            <label className="label">Filter name: (optional)</label>
            <p className="control">
              <input
                type="text"
                name="filterKey"
                className="input"
                autoFocus="autofocus"
                placeholder="e.g., Team mentions"
              />
            </p>
            <label className="label">Search query:</label>
            <div className="control">
              <FilterSuggester
                className={valueClass}
                inputID="new-filter-query"
              />
            </div>
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
        </div>
      </div>
    )
  }
}

NewFilter.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  manageFilters: React.PropTypes.func.isRequired,
  loadFilter: React.PropTypes.func.isRequired,
}

const stickyNav = hookUpStickyNav(NewFilter, '#new-filter-top-navigation')
module.exports = connect()(stickyNav)
