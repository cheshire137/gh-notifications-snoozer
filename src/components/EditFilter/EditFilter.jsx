const { connect } = require('react-redux')
const React = require('react')
const FilterSuggester = require('../FilterSuggester')
const hookUpStickyNav = require('../hookUpStickyNav')

class EditFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { valueHasError: false }
  }

  save(event) {
    event.preventDefault()
    if (this.state.value.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })

    const dispatchArgs = Object.assign({}, { type: 'FILTERS_UPDATE' }, this.props.filter)
    this.props.dispatch(dispatchArgs)
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
                value={this.props.filter.name}
                onChange={event => (this.props.filter.key = event.target.value)}
                placeholder="e.g., Team mentions"
                autoFocus="autofocus"
              />
            </p>
            <label className="label">Search query:</label>
            <div className="control">
              <FilterSuggester
                className={valueClass}
                value={this.props.filter.query}
                onChange={val => (this.props.filter.query = val)}
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
  filter: React.PropTypes.string.isRequired,
  cancel: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}

const stickyNav = hookUpStickyNav(EditFilter, '#edit-filter-top-navigation')
module.exports = connect()(stickyNav)
