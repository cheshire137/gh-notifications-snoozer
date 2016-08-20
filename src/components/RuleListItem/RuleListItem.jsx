const React = require('react')

const Rule = require('../../models/rule')

class RuleListItem extends React.Component {
  render() {
    const rule = new Rule(this.props.rule)
    return (
      <li className="rule-list-item">
        <div className="columns">
          <div className="column rule-key is-3">
            {rule.key}
          </div>
          <div className="column is-7">
            {rule.retrieve()}
          </div>
          <div className="column is-2 has-text-right">
            <button
              onClick={() => this.props.delete(this.props.rule)}
              type="button"
              className="button"
            >Delete</button>
          </div>
        </div>
      </li>
    )
  }
}

RuleListItem.propTypes = {
  rule: React.PropTypes.string.isRequired,
  delete: React.PropTypes.func.isRequired,
}

module.exports = RuleListItem
