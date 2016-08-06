const React = require('react')

const Rule = require('../../models/rule')

class RuleListItem extends React.Component {
  render() {
    const rule = new Rule(this.props.rule)
    return (
      <li className="rule-list-item">
        <div className="columns">
          <div className="column rule-key is-4">
            {rule.key}
          </div>
          <div className="column is-8">
            {rule.retrieve()}
          </div>
        </div>
      </li>
    )
  }
}

RuleListItem.propTypes = {
  rule: React.PropTypes.string.isRequired,
}

module.exports = RuleListItem
