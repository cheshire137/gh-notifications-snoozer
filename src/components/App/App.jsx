const { connect } = require('react-redux')
const React = require('react')

const Rule = require('../../models/rule')
const Rules = require('../../models/rules')
const GitHub = require('../../models/github')
const Filter = require('../Filter')
const TaskList = require('../TaskList')
const RuleList = require('../RuleList')
const NewRule = require('../NewRule')
const Config = require('../../config.json')

class App extends React.Component {
  constructor() {
    super()
    this.state = { view: 'tasks' }
  }

  componentDidMount() {
    const rules = Rules.findAll()
    if (rules.length > 0) {
      this.loadRule(rules[0])
    } else {
      this.loadTasks(Config.searchQuery)
    }
  }

  loadTasks(query) {
    const github = new GitHub()
    github.getTasks(query).then(tasks => {
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks })
    })
  }

  addRule() {
    this.setState({ view: 'new-rule' })
  }

  savedRule(ruleKey) {
    this.setState({ view: 'tasks' })
    this.loadRule(ruleKey)
  }

  cancelledNewRule() {
    this.setState({ view: 'tasks' })
  }

  loadRule(ruleKey) {
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    const rule = new Rule(ruleKey)
    const query = rule.retrieve()
    this.loadTasks(query)
  }

  manageRules() {
    this.setState({ view: 'rules' })
  }

  render() {
    if (this.state.view === 'tasks') {
      return (
        <div className="tasks-view">
          <Filter
            addRule={() => this.addRule()}
            changeRule={ruleKey => this.loadRule(ruleKey)}
            manageRules={() => this.manageRules()}
          />
          <TaskList />
        </div>
      )
    }

    if (this.state.view === 'rules') {
      return (
        <div className="rules-view">
          <RuleList />
        </div>
      )
    }

    return (
      <div className="new-rule-view">
        <NewRule
          save={ruleKey => this.savedRule(ruleKey)}
          cancel={() => this.cancelledNewRule()}
        />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
