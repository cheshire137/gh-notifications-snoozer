const React = require('react')
const Config = require('../../config.json')
const Rules = require('../../models/rules')

class Filter extends React.Component {
  render() {
    const savedRules = Rules.findAll()
    console.log('saved rules', savedRules)
    const rules = savedRules.length > 0 ? savedRules : [Config.searchQuery]
    return (
      <div className="filter columns">
        <div className="column is-8">
          <label className="label" htmlFor="rules-select">Filter:</label>
          <span className="select">
            <select id="rules-select">
              {rules.map(ruleKey => {
                return <option key={ruleKey}>{ruleKey}</option>
              })}
            </select>
          </span>
        </div>
        <div className="column is-4 has-text-right">
          <button onClick={this.props.addRule} type="button" className="is-link button">
            Add rule
            <span className="octicon octicon-chevron-down"></span>
          </button>
        </div>
      </div>
    )
  }
}

Filter.propTypes = {
  addRule: React.PropTypes.func.isRequired,
  changeRule: React.PropTypes.func.isRequired,
}

module.exports = Filter
