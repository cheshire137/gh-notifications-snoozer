const React = require('react')
const Rules = require('../../models/rules')
const RuleListItem = require('../RuleListItem')

class RuleList extends React.Component {
  render() {
    const rules = Rules.findAll()
    return (
      <ul className="rule-list">
        {rules.map(ruleKey => <RuleListItem key={ruleKey} rule={ruleKey} />)}
      </ul>
    )
  }
}

module.exports = RuleList
