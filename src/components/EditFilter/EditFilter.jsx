const React = require('react')
const Filter = require('../../models/filter')

class EditFilter extends React.Component {
  constructor(props) {
    super(props)
    const { filter } = props
    this.state = {
      valueHasError: false,
      key: filter.key,
      value: filter.retrieve(),
    }
  }

  save(event) {
    event.preventDefault()
    const form = event.target
    if (this.state.value.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })
    let key = form.filterKey.value.trim()
    if (key.length < 1) {
      key = this.state.value
    }
    const filter = new Filter(key)
    filter.store(this.state.value)
    this.props.save(key)
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  valueChanged(event) {
    this.setState({ value: event.target.value.trim() })
  }

  keyChanged(event) {
    this.setState({ key: event.target.value.trim() })
  }

  render() {
    let valueClass = 'input'
    if (this.state.valueHasError) {
      valueClass += ' is-danger'
    }
    return (
      <div>
        <h1 className="title">
          <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
          <span> / </span>
          Edit Filter
        </h1>
        <form className="new-filter-form" onSubmit={event => this.save(event)}>
          <label className="label">Search query:</label>
          <p className="control">
            <input
              type="text"
              name="filterValue"
              className={valueClass}
              value={this.state.value}
              onChange={e => this.valueChanged(e)}
              placeholder="e.g., team:org/team-name is:open"
            />
          </p>
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
      </div>
    )
  }
}

EditFilter.propTypes = {
  filter: React.PropTypes.object.isRequired,
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = EditFilter
