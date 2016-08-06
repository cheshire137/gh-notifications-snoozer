const React = require('react')
const RuleListItem = require('../RuleListItem')

class RuleList extends React.Component {
  render() {
    return (
      <div>
        <div className="columns">
          <div className="column is-3">
            <button onClick={this.props.cancel} type="button" className="button">
              <span className="octicon octicon-chevron-left"></span>
              Back to notifications
            </button>
          </div>
          <div className="column is-3">
            <button onClick={this.props.addRule} type="button" className="button">
              Add rule
            </button>
          </div>
        </div>
        <ul className="rule-list">
          {this.props.rules.map(ruleKey => {
            return (
              <RuleListItem
                key={ruleKey}
                rule={ruleKey}
                delete={this.props.delete}
              />
            )
          })}
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
