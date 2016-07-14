const React = require('react')
const Filter = require('../Filter')
const TaskList = require('../TaskList')

class Main extends React.Component {
  render() {
    return (
      <div>
        <Filter />
        <TaskList />
      </div>
    )
  }
}

module.exports = Main
