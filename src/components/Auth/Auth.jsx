const React = require('react')
const shell = require('electron').shell

const GitHubAuth = require('../../models/github-auth')
const GitHub = require('../../models/github')

class Auth extends React.Component {
  constructor() {
    super()
    this.state = { tokenHasError: false, token: GitHubAuth.getToken() || '' }
  }

  save(event) {
    event.preventDefault()
    if (this.state.token.length < 1) {
      this.setState({ tokenHasError: true, error: 'Cannot be blank' })
      return
    }
    const github = new GitHub(this.state.token)
    github.getCurrentUser().then(user => {
      this.setState({ tokenHasError: false, error: null })
      GitHubAuth.setToken(this.state.token)
      this.props.done(user)
    }).catch(error => {
      this.setState({ tokenHasError: true, error: error.message })
    })
  }

  updateToken(event) {
    this.setState({
      token: event.currentTarget.value,
      tokenHasError: false,
      error: null,
    })
  }

  openLink(event) {
    event.preventDefault()
    event.currentTarget.blur()
    shell.openExternal(event.currentTarget.href)
  }

  cancel(event) {
    event.preventDefault()
    event.currentTarget.blur()
    this.props.done()
  }

  inputClass() {
    let css = 'input'
    if (this.state.tokenHasError) {
      css += ' is-danger'
    }
    return css
  }

  render() {
    const authFile = GitHubAuth.path()
    return (
      <div className="auth-container">
        <div className="auth-top-navigation">
          <h1 className="title">
            {this.props.isAuthenticated ? (
              <span>
                <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
                <span> / </span>
              </span>
            ) : ''}
            Authenticate
          </h1>
        </div>
        {this.props.isAuthenticated ? (
          <p className="notification is-success">
            You are authenticated. Your GitHub token is stored in
            <code> {authFile}</code>.
          </p>
        ) : ''}
        <form className="auth-form" onSubmit={event => this.save(event)}>
          <p>
            You must provide a GitHub personal access token.
            <a
              href="https://github.com/settings/tokens/new"
              onClick={event => this.openLink(event)}
            > Create a token </a>
            with the <code>repo</code> scope:
          </p>
          <p>
            <img
              className="scope-screenshot"
              src="components/Auth/scope-screenshot.png"
              alt="Repo scope"
            />
          </p>
          {this.state.tokenHasError ? (
            <p className="notification is-danger">
              {this.state.error}
            </p>
          ) : ''}
          <div className="control is-horizontal">
            <div className="control-label">
              <label className="label">Your token:</label>
            </div>
            <p className="control is-fullwidth has-icon">
              <input
                type="text"
                name="token"
                className={this.inputClass()}
                value={this.state.token}
                onChange={event => this.updateToken(event)}
                autoFocus="autofocus"
              />
              <span className="fa octicon octicon-key"></span>
            </p>
          </div>
          <p className="help">
            Your token will be stored in <code>{authFile}</code>.
          </p>
          <p className="control">
            <button type="submit" className="button is-primary">
              Save Token
            </button>
          </p>
        </form>
      </div>
    )
  }
}

Auth.propTypes = {
  done: React.PropTypes.func.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
}

module.exports = Auth
