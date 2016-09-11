const React = require('react')
const shell = require('electron').shell

const GitHubAuth = require('../../models/GitHubAuth')
const GitHub = require('../../models/GitHub')
const hookUpStickyNav = require('../hookUpStickyNav')

class Auth extends React.Component {
  constructor() {
    super()
    const token = GitHubAuth.getToken() || ''
    this.state = {
      tokenHasError: false,
      token,
      disabledButton: token.length < 1,
    }
  }

  save(event) {
    event.preventDefault()
    if (this.state.token.length < 1) {
      this.setState({
        tokenHasError: true,
        error: 'Cannot be blank',
        disabledButton: true,
      })
      return
    }
    const github = new GitHub(this.state.token)
    github.getCurrentUser().then(user => {
      this.setState({
        tokenHasError: false,
        error: null,
        disabledButton: false,
      })
      GitHubAuth.setToken(this.state.token)
      this.props.done(user)
    }).catch(error => {
      this.setState({
        tokenHasError: true,
        error: error.message,
        disabledButton: false,
      })
    })
  }

  updateToken(event) {
    const token = event.currentTarget.value
    this.setState({
      token,
      tokenHasError: false,
      error: null,
      disabledButton: token.length < 1,
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
    this.props.done(this.props.user)
  }

  inputClass() {
    let css = 'input'
    if (this.state.tokenHasError) {
      css += ' is-danger'
    }
    return css
  }

  deleteToken(event) {
    event.preventDefault()
    event.currentTarget.blur()
    GitHubAuth.deleteToken()
    this.setState({
      token: '',
      tokenHasError: false,
      error: null,
      disabledButton: true,
    })
    this.props.done()
  }

  authSuccessMessage() {
    if (!this.props.isAuthenticated) {
      return ''
    }
    return (
      <p className="notification is-success">
        You are
        {typeof this.props.user === 'object' ? (
          <span> authenticated as
            <strong> {this.props.user.login}</strong>.
            <span> </span>
            <a
              href="#"
              onClick={event => this.deleteToken(event)}
            >Log out</a>
          </span>
        ) : ' authenticated.'}
      </p>
    )
  }

  tokenErrorMessage() {
    if (!this.state.tokenHasError) {
      return ''
    }
    return (
      <p className="notification is-danger">
        {this.state.error}
      </p>
    )
  }

  tasksBackLink() {
    if (!this.props.isAuthenticated) {
      return ''
    }
    return (
      <span>
        <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
        <span> / </span>
      </span>
    )
  }

  render() {
    const authFile = GitHubAuth.path()
    return (
      <div>
        <nav id="auth-top-navigation" className="nav top-nav">
          <h1 className="title">
            {this.tasksBackLink()}
            Authenticate
          </h1>
        </nav>
        <div className="auth-container">
          {this.authSuccessMessage()}
          <form className="auth-form" onSubmit={event => this.save(event)}>
            {this.tokenErrorMessage()}
            <p className="control">
              You must provide a GitHub personal access token.
              <a
                href="https://github.com/settings/tokens/new"
                onClick={event => this.openLink(event)}
              > Create a token </a>
              with the <code>repo</code> scope and paste it below.
            </p>
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
              Your token
              {this.props.isAuthenticated ? ' is stored ' : ' will be stored '}
              in: <code>{authFile}</code>
            </p>
            <p className="control">
              <button
                type="submit"
                className="button is-primary"
                disabled={this.state.disabledButton}
              >Save Token</button>
              {this.props.isAuthenticated ? (
                <button
                  type="button"
                  onClick={e => this.cancel(e)}
                  className="button is-link"
                >Cancel</button>
              ) : ''}
            </p>
            <hr />
            <h2 className="subtitle">Token Scope</h2>
            <p>
              <img
                className="scope-screenshot"
                src="components/Auth/scope-screenshot.png"
                alt="Repo scope"
              />
            </p>
          </form>
        </div>
      </div>
    )
  }
}

Auth.propTypes = {
  done: React.PropTypes.func.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object,
}

module.exports = hookUpStickyNav(Auth, 'auth-top-navigation')
