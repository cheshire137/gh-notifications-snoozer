const { connect } = require('react-redux')
const React = require('react')

const GitHub = require('../../models/github')
const Filter = require('../Filter')
const TaskList = require('../TaskList')

class App extends React.Component {
  componentDidMount() {
    const github = new GitHub()
    github.getTasks().then(tasks => {
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks })
    })
  }

  render() {
    return (
      <div>
        <Filter />
        <TaskList />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
