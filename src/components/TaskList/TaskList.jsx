const React = require('react')

class TaskList extends React.Component {
  render() {
    return (
      <div>
        <nav className="controls-container">
          <button type="button" className="control">snooze</button>
          <button type="button" className="control">ignore</button>
          <button type="button" className="control">archive</button>
        </nav>
        <ol className="issues-list">
          <li>LOOK AT THIS ISSUE</li>
        </ol>
      </div>
    )
  }
}

module.exports = TaskList
