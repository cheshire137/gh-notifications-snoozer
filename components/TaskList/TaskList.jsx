const React = require('react')

class TaskList extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <button>snooze</button>
          <button>ignore</button>
          <button>archive</button>
        </nav>
        <ol>
          <li>LOOK AT THIS ISSUE</li>
        </ol>
      </div>
    )
  }
}

module.exports = TaskList
