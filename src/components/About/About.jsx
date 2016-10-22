const { shell, remote } = require('electron')
const React = require('react')
const { app } = remote

class About extends React.Component {
  handleLinkClick(event) {
    event.preventDefault()
    const link = event.currentTarget
    link.blur()
    shell.openExternal(link.href)
  }

  render() {
    const name = app.getName()
    return (
      <div id="about-container" className="content">
        <h2 className="subtitle">About {name}</h2>
        <div className="columns">
          <div className="column is-three-quarters">
            <p>
              <span>{name} was built by </span>
              <a
                href="https://github.com/probablycorey"
                onClick={e => this.handleLinkClick(e)}
              >
                <img
                  src="https://github.com/probablycorey.png?size=20"
                  className="about-avatar"
                  alt="probablycorey"
                /> @probablycorey
              </a><span>, </span>
              <a
                href="https://github.com/cheshire137"
                onClick={e => this.handleLinkClick(e)}
              >
                <img
                  src="https://github.com/cheshire137.png?size=20"
                  className="about-avatar"
                  alt="cheshire137"
                /> @cheshire137
              </a><span>, and </span>
              <a
                href="https://github.com/summasmiff"
                onClick={e => this.handleLinkClick(e)}
              >
                <img
                  src="https://github.com/summasmiff.png?size=20"
                  className="about-avatar"
                  alt="summasmiff"
                /> @summasmiff
              </a>.
            </p>
            <p>
              <strong>Version: </strong>
              <span> {app.getVersion()}</span>
            </p>
            <p>
              <a
                href="https://github.com/cheshire137/gh-notifications-snoozer/"
                onClick={e => this.handleLinkClick(e)}
              >View source</a>
              <span> | </span>
              <a
                href="https://github.com/cheshire137/gh-notifications-snoozer/issues"
                onClick={e => this.handleLinkClick(e)}
              >File a bug</a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = About
