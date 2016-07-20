const React = require('react')

class TaskList extends React.Component {
  render() {
    return (
      <div>
        <nav className="controls-container">
          <button type="button" className="control button">snooze</button>
          <button type="button" className="control button">ignore</button>
          <button type="button" className="control button">archive</button>
        </nav>
        <ol className="issues-list">
          <li>LOOK AT THIS ISSUE</li>
        </ol>
      </div>
    )
  }
}

module.exports = TaskList
