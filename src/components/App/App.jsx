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
    this.state = { view: 'tasks', rules: Rules.findAll() }
  }

  componentDidMount() {
    if (this.state.rules.length > 0) {
      this.loadRule(this.state.rules[0])
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

  showNewRuleForm() {
    this.setState({ view: 'new-rule' })
  }

  savedRule() {
    this.setState({ view: 'tasks', rules: Rules.findAll() })
  }

  showTaskList() {
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

  deleteRule(ruleKey) {
    const rule = new Rule(ruleKey)
    const remainingRules = rule.delete()
    this.setState({ rules: remainingRules })
  }

  render() {
    if (this.state.view === 'tasks') {
      return (
        <div className="tasks-view">
          <Filter
            addRule={() => this.showNewRuleForm()}
            changeRule={ruleKey => this.loadRule(ruleKey)}
            manageRules={() => this.manageRules()}
          />
          <TaskList />
        </div>
      )
    }

    if (this.state.view === 'rules') {
      return (
        <RuleList
          rules={this.state.rules}
          delete={(ruleKey) => this.deleteRule(ruleKey)}
          addRule={() => this.showNewRuleForm()}
          cancel={() => this.showTaskList()}
        />
      )
    }

    return (
      <NewRule
        save={() => this.savedRule()}
        cancel={() => this.showTaskList()}
      />
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
