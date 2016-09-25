const React = require('react')

class FilterSuggester extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.value || '' }
  }

  onChange(event) {
    this.setState({ value: event.target.value })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    const inputClass = this.props.className || ''
    return (
      <div>
        <input
          type="text"
          className={inputClass}
          name="filterValue"
          value={this.state.value}
          onChange={e => this.onChange(e)}
          placeholder="e.g., team:org/team-name is:open sort:updated-desc"
        />
      </div>
    )
  }
}

FilterSuggester.propTypes = {
  className: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
}

module.exports = FilterSuggester
