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

  onFocus() {
    this.setState({ showSuggestions: true })
  }

  onBlur() {
    this.setState({ showSuggestions: false })
  }

  render() {
    const inputClass = this.props.className || ''
    return (
      <div className="filter-suggester-container">
        <input
          type="text"
          className={inputClass}
          name="filterValue"
          value={this.state.value}
          onChange={e => this.onChange(e)}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          placeholder="e.g., team:org/team-name is:open sort:updated-desc"
        />
        {this.state.showSuggestions ? (
          <div className="card suggestions-container">
            <div className="card-content">
              <h3 className="card-header-title">Refine your filter:</h3>
              <ul className="suggestions-list">
                <li>
                  <strong>type:</strong> &mdash; issue, pr
                </li>
                <li>
                  <strong>in:</strong> &mdash; title, body, comments
                </li>
                <li>
                  <strong>state:</strong> &mdash; open, closed
                </li>
                <li>
                  <strong>label:</strong> &mdash; label name
                </li>
                <li>
                  <strong>is:</strong> &mdash;  open, closed, merged
                </li>
                <li>
                  <strong>no:</strong> &mdash; label, milestone, assignee
                </li>
                <li className="last-in-section">
                  <strong>language:</strong> &mdash; language name
                </li>

                <li>
                  <strong>author:</strong> &mdash; username
                </li>
                <li>
                  <strong>assignee:</strong> &mdash; username
                </li>
                <li>
                  <strong>mentions:</strong> &mdash; username
                </li>
                <li>
                  <strong>commenter:</strong> &mdash; username
                </li>
                <li className="last-in-section">
                  <strong>involves:</strong> &mdash; username
                </li>

                <li>
                  <strong>team:</strong> &mdash; team name
                </li>
                <li>
                  <strong>user:</strong> &mdash; username
                </li>
                <li>
                  <strong>org:</strong> &mdash; organization name
                </li>
                <li className="last-in-section">
                  <strong>repo:</strong> &mdash; user/repo or org/repo
                </li>

                <li>
                  <strong>created:</strong> &mdash; date
                </li>
                <li>
                  <strong>updated:</strong> &mdash; date
                </li>
                <li>
                  <strong>closed:</strong> &mdash; date
                </li>
                <li className="last-in-section">
                  <strong>merged:</strong> &mdash; date
                </li>

                <li className="last-in-section">
                  <strong>status:</strong> &mdash; pending, failure, success
                </li>

                <li>
                  <strong>head:</strong> &mdash; branch name
                </li>
                <li className="last-in-section">
                  <strong>base:</strong> &mdash; branch name
                </li>

                <li>
                  <strong>sort:</strong> &mdash; comments, created, updated, reactions, interactions
                </li>
                <li className="last-in-section">
                  <strong>milestone:</strong> &mdash; milestone name
                </li>

                <li>
                  <strong>comments:</strong> &mdash; number
                </li>
                <li>
                  <strong>reactions:</strong> &mdash; number
                </li>
                <li>
                  <strong>interactions:</strong> &mdash; number
                </li>
              </ul>
            </div>
          </div>
        ) : ''}
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
