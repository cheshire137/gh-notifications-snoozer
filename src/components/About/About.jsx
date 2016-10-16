const { shell, remote } = require('electron')
const React = require('react')
const { app } = remote

class About extends React.Component {
  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  handleLinkClick(event) {
    event.preventDefault()
    const link = event.currentTarget
    link.blur()
    shell.openExternal(link.href)
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
          {app.getName()}
          <span> was built by </span>
          <a
            href="https://github.com/probablycorey"
            onClick={e => this.handleLinkClick(e)}
          >@probablycorey</a><span>, </span>
          <a
            href="https://github.com/cheshire137"
            onClick={e => this.handleLinkClick(e)}
          >@cheshire137</a><span>, and </span>
          <a
            href="https://github.com/summasmiff"
            onClick={e => this.handleLinkClick(e)}
          >@summasmiff</a>.
        </p>
        <p>
          <strong>Version: </strong> {app.getVersion()}
        </p>
      </div>
    )
  }
}

About.propTypes = {
  cancel: React.PropTypes.func.isRequired,
}

module.exports = About
