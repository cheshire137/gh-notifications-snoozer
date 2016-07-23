const React = require('react')
const Filter = require('../Filter')
const TaskList = require('../TaskList')

module.exports = () => {
  return (
    <div>
      <Filter />
      <TaskList />
    </div>
  )
}
