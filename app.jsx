const React = require('react')
const Filter = require('./filter')
const TaskList = require('./task-list')

class App extends React.Component {
  render() {
    return (
      <div>
        <Filter />
        <TaskList />
      </div>
    )
  }
}

module.exports = App
