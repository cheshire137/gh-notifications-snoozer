const React = require('react')
const Rule = require('../../models/rule')

class NewRule extends React.Component {
  constructor() {
    super()
    this.state = { valueHasError: false }
  }

  save(event) {
    event.preventDefault()
    const form = event.target
    const value = form.ruleValue.value.trim()
    if (value.length < 1) {
      this.setState({ valueHasError: true })
      return
    }
    this.setState({ valueHasError: false })
    let key = form.ruleKey.value.trim()
    if (key.length < 1) {
      key = value
    }
    const rule = new Rule(key)
    rule.store(value)
    this.props.save(key)
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  render() {
    let valueClass = 'input'
    if (this.state.valueHasError) {
      valueClass += ' is-danger'
    }
    return (
      <div>
        <h1 className="title">
          <a href="#" onClick={event => this.cancel(event)}>Tasks</a>
          <span> / </span>
          Add a Filter
        </h1>
        <form onSubmit={event => this.save(event)}>
          <label className="label">Issue query:</label>
          <p className="control">
            <input
              type="text"
              name="ruleValue"
              className={valueClass}
              placeholder="@org/team-name"
            />
          </p>
          <label className="label">Rule name: (optional)</label>
          <p className="control">
            <input type="text" name="ruleKey" className="input" placeholder="Team mentions" />
          </p>
          <p className="control">
            <button type="submit" className="button is-primary">
              Save Filter
            </button>
            <button type="button" onClick={this.props.cancel} className="button is-link">
              Cancel
            </button>
          </p>
        </form>
      </div>
    )
  }
}

NewRule.propTypes = {
  save: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = NewRule
