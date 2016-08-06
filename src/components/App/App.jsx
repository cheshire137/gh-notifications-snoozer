const { connect } = require('react-redux')
const React = require('react')

const GitHub = require('../../models/github')
const Filter = require('../Filter')
const TaskList = require('../TaskList')
const NewRule = require('../NewRule')

class App extends React.Component {
  constructor() {
    super()
    this.state = { view: 'tasks' }
  }

  componentDidMount() {
    const github = new GitHub()
    github.getTasks().then(tasks => {
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks })
    })
  }

  addRule() {
    this.setState({ view: 'new-rule' })
  }

  savedRule(ruleKey) {
    console.log('new rule', ruleKey)
  }

  cancelledNewRule() {
    this.setState({ view: 'tasks' })
  }

  loadRule(ruleKey) {
    console.log('load rule', ruleKey)
  }

  render() {
    if (this.state.view === 'tasks') {
      return (
        <div className="tasks-view">
          <Filter
            addRule={() => this.addRule()}
            changeRule={ruleKey => this.loadRule(ruleKey)}
          />
          <TaskList />
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
