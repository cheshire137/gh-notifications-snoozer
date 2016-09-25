const React = require('react')
const Filter = require('../../models/Filter')
const FilterSuggester = require('../FilterSuggester')
const hookUpStickyNav = require('../hookUpStickyNav')

class EditFilter extends React.Component {
  constructor(props) {
    super(props)
    const { filter } = props
    this.state = {
      valueHasError: false,
      key: filter,
      value: new Filter(filter).retrieve(),
    }
  }

  save(event) {
    event.preventDefault()
    if (this.state.value.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })
    let key = this.state.key.trim()
    if (key.length < 1) {
      key = this.state.value
    }
    const filter = new Filter(key)
    filter.store(this.state.value)
    if (this.props.filter !== key) {
      this.props.delete(this.props.filter)
    }
    this.props.save(key)
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  valueChanged(event) {
    this.setState({ value: event.target.value })
  }

  keyChanged(event) {
    this.setState({ key: event.target.value })
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
                value={this.state.key}
                onChange={e => this.keyChanged(e)}
                placeholder="e.g., Team mentions"
              />
            </p>
            <label className="label">Search query:</label>
            <div className="control">
              <FilterSuggester
                className={valueClass}
                value={this.state.value}
                onChange={e => this.valueChanged(e)}
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
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  delete: React.PropTypes.func.isRequired,
}

module.exports = hookUpStickyNav(EditFilter, '#edit-filter-top-navigation')
