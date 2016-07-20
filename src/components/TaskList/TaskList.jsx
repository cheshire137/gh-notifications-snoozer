const React = require('react')
const GitHub = require('../../models/github')

class TaskList extends React.Component {
  componentDidMount() {
    const github = new GitHub()
    github.getNotifications().
           then(this.onNotificationsLoaded.bind(this)).
           catch(this.onNotificationsError.bind(this))
  }

  onNotificationsLoaded(notifications) {
    console.log('notifications', notifications)
  }

  onNotificationsError(response) {
    console.error('failed to load notifications', response)
  }

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
