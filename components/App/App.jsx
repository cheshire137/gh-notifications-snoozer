const React = require('react')

const { connect } = require('react-redux')
const Filter = require('../Filter')
const TaskList = require('../TaskList')

const App = () => {
  return (
    <div>
      <Filter />
      <TaskList />
    </div>
  )
}

const mapStateToProps = (tasks) => {
  return {
    tasks: tasks
  }
}

module.exports = connect(mapStateToProps)(App)
