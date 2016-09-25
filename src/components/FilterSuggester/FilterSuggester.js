const React = require('react')

class FilterSuggester extends React.Component {
  onChange(event) {
    event.target.blur()
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    const inputClass = this.props.className || ''
    const value = this.props.value || ''
    return (
      <div>
        <input
          type="text"
          className={inputClass}
          name="filterValue"
          value={value}
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
