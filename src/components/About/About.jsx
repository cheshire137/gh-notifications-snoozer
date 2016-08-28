const React = require('react')
const path = require('path')
const packagePath = path.join(__dirname, '..', '..', '..', 'package.json')
const packageInfo = require(packagePath)

class About extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    return (
      <div>
        <h1 className="title">
          <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
          <span> / </span>
          About
        </h1>
        <p>
          <strong>Version: </strong> {packageInfo.version}
        </p>
      </div>
    )
  }
}

About.propTypes = {
  cancel: React.PropTypes.func.isRequired,
}

module.exports = About
