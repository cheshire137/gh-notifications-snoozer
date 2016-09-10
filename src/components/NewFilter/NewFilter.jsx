const React = require('react')
const Filter = require('../../models/filter')
const FilterHelp = require('../FilterHelp')

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
      <div className="new-filter-container">
        <div className="columns new-filter-top-navigation">
          <div className="column is-7">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Add a Filter
            </h1>
          </div>
          <div className="column is-5 has-text-right">
            <button
              onClick={this.props.manageFilters}
              type="button"
              className="is-link button"
              title="Manage filters"
            ><span className="octicon octicon-beaker"></span></button>
          </div>
        </div>
        <form className="new-filter-form" onSubmit={event => this.save(event)}>
          <label className="label">Search query:</label>
          <p className="control">
            <input
              type="text"
              name="filterValue"
              className={valueClass}
              placeholder="e.g., team:org/team-name is:open sort:updated-desc"
            />
          </p>
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
            <button type="submit" className="button is-primary">
              Save Filter
            </button>
            <button
              type="button"
              onClick={this.props.cancel}
              className="button is-link"
            >Cancel</button>
          </p>
        </form>
        <FilterHelp />
      </div>
    )
  }
}

NewFilter.propTypes = {
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  manageFilters: React.PropTypes.func.isRequired,
}

module.exports = NewFilter
