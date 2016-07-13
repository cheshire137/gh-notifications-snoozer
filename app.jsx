const React = require('react')
const Filter = require('./components/Filter')
const TaskList = require('./components/TaskList')

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
