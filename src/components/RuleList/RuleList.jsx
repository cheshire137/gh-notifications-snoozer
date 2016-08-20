const React = require('react')
const RuleListItem = require('../RuleListItem')

class RuleList extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    return (
      <div>
        <div className="columns">
          <div className="column is-6">
            <h1 className="title">
              <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
              <span> / </span>
              Manage Filters
            </h1>
          </div>
          <div className="column is-6 has-text-right">
            <button onClick={this.props.addRule} type="button" className="button">
              Add a filter
            </button>
          </div>
        </div>
        <ul className="rule-list">
          {this.props.rules.map(ruleKey => (
            <RuleListItem
              key={ruleKey}
              rule={ruleKey}
              delete={this.props.delete}
            />
          ))}
        </ul>
      </div>
    )
  }
}

RuleList.propTypes = {
  rules: React.PropTypes.array.isRequired,
  delete: React.PropTypes.func.isRequired,
  addRule: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = RuleList
