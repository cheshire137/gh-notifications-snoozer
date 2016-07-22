const React = require('react')

class TaskListItem extends React.Component {
  render() {
    return (
      <li>
        {this.props.subject.title}
        <span>&middot;</span>
        {this.props.updated_at}
      </li>
    )
  }
}

TaskListItem.propTypes = {
  subject: React.PropTypes.object.isRequired,
  updated_at: React.PropTypes.string.isRequired,
}

module.exports = TaskListItem
