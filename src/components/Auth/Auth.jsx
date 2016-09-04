const React = require('react')
const shell = require('electron').shell

const GitHubAuth = require('../../models/github-auth')

class Auth extends React.Component {
  constructor() {
    super()
    this.state = { tokenHasError: false }
  }

  save(event) {
    event.preventDefault()
    const form = event.target
    const value = form.token.value.trim()
    if (value.length < 1) {
      this.setState({ tokenHasError: true })
      return
    }
    this.setState({ tokenHasError: false })
    GitHubAuth.setToken(value)
    this.props.save()
  }

  openLink(event) {
    event.preventDefault()
    event.target.blur()
    shell.openExternal(event.currentTarget.href)
  }

  cancel(event) {
    event.preventDefault()
    if (typeof this.props.cancel === 'function') {
      this.props.cancel()
    }
  }

  render() {
    let valueClass = 'input'
    if (this.state.tokenHasError) {
      valueClass += ' is-danger'
    }
    return (
      <div className="auth-container">
        <div className="auth-top-navigation">
          <h1 className="title">
            {typeof this.props.cancel === 'function' ? (
              <span>
                <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
                <span> / </span>
              </span>
            ) : ''}
            Authenticate
          </h1>
        </div>
        <form className="auth-form" onSubmit={event => this.save(event)}>
          <p>
            You must provide a GitHub personal access token.
            <a
              href="https://github.com/settings/tokens/new"
              onClick={event => this.openLink(event)}
            >Create a token</a>
            with the <code>repo</code> scope.
          </p>
          <label className="label">Your token:</label>
          <p className="control">
            <input
              type="text"
              name="token"
              className={valueClass}
            />
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
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func,
}

module.exports = Auth
