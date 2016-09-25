const React = require('react')
const Autosuggest = require('react-autosuggest')

const filters = [
  {
    name: 'type:',
    tip: 'issue, pr',
    group: 'general',
    suggestions: [
      { name: 'issue', prefix: 'type:' },
      { name: 'pr', prefix: 'type:' },
    ],
  },
  {
    name: 'in:',
    tip: 'title, body, comments',
    group: 'general',
    suggestions: [
      { name: 'title', prefix: 'in:' },
      { name: 'body', prefix: 'in:' },
      { name: 'comments', prefix: 'in:' },
    ],
  },
  {
    name: 'state:',
    tip: 'open, closed',
    group: 'general',
    suggestions: [
      { name: 'open', prefix: 'state:' },
      { name: 'closed', prefix: 'state:' },
    ],
  },
  {
    name: 'label:',
    tip: 'label name',
    group: 'general',
  },
  {
    name: 'is:',
    tip: 'open, closed, merged',
    group: 'general',
    suggestions: [
      { name: 'open', prefix: 'is:' },
      { name: 'closed', prefix: 'is:' },
      { name: 'merged', prefix: 'is:' },
    ],
  },
  {
    name: 'no:',
    tip: 'label, milestone, assignee',
    group: 'general',
    suggestions: [
      { name: 'label', prefix: 'no:' },
      { name: 'milestone', prefix: 'no:' },
      { name: 'assignee', prefix: 'no:' },
    ],
  },
  {
    name: 'language:',
    tip: 'language name',
    group: 'general',
  },
  {
    name: 'status:',
    tip: 'pending, failure, success',
    group: 'general',
    suggestions: [
      { name: 'pending', prefix: 'status:' },
      { name: 'failure', prefix: 'status:' },
      { name: 'success', prefix: 'status:' },
    ],
  },
  {
    name: 'sort:',
    tip: 'comments, created, updated, reactions, interactions',
    group: 'general',
    suggestions: [
      { name: 'updated-desc', prefix: 'sort:' },
      { name: 'created-desc', prefix: 'sort:' },
      { name: 'comments-desc', prefix: 'sort:' },
      { name: 'reactions-desc', prefix: 'sort:' },
      { name: 'interactions-desc', prefix: 'sort:' },
      { name: 'updated', prefix: 'sort:' },
      { name: 'created', prefix: 'sort:' },
      { name: 'comments', prefix: 'sort:' },
      { name: 'reactions', prefix: 'sort:' },
      { name: 'interactions', prefix: 'sort:' },
      { name: 'reactions-+1-desc', prefix: 'sort:' },
      { name: 'reactions--1-desc', prefix: 'sort:' },
      { name: 'reactions-smile-desc', prefix: 'sort:' },
      { name: 'reactions-thinking_face-desc', prefix: 'sort:' },
      { name: 'reactions-heart-desc', prefix: 'sort:' },
      { name: 'reactions-tada-desc', prefix: 'sort:' },
      { name: 'reactions-+1', prefix: 'sort:' },
      { name: 'reactions--1', prefix: 'sort:' },
      { name: 'reactions-smile', prefix: 'sort:' },
      { name: 'reactions-thinking_face', prefix: 'sort:' },
      { name: 'reactions-heart', prefix: 'sort:' },
      { name: 'reactions-tada', prefix: 'sort:' },
    ],
  },
  {
    name: 'milestone:',
    tip: 'milestone name',
    group: 'general',
  },
  {
    name: 'author:',
    tip: 'username',
    group: 'user',
  },
  {
    name: 'assignee:',
    tip: 'username',
    group: 'user',
  },
  {
    name: 'mentions:',
    tip: 'username',
    group: 'user',
  },
  {
    name: 'commenter:',
    tip: 'username',
    group: 'user',
  },
  {
    name: 'involves:',
    tip: 'username',
    group: 'user',
  },
  {
    name: 'team:',
    tip: 'team name',
    group: 'owner',
  },
  {
    name: 'user:',
    tip: 'username',
    group: 'owner',
  },
  {
    name: 'org:',
    tip: 'organization name',
    group: 'owner',
  },
  {
    name: 'repo:',
    tip: 'user/repo or org/repo',
    group: 'owner',
  },
  {
    name: 'created:',
    tip: 'date',
    group: 'date',
  },
  {
    name: 'updated:',
    tip: 'date',
    group: 'date',
  },
  {
    name: 'closed:',
    tip: 'date',
    group: 'date',
  },
  {
    name: 'merged:',
    tip: 'date',
    group: 'date',
  },
  {
    name: 'head:',
    tip: 'branch name',
    group: 'branch',
  },
  {
    name: 'base:',
    tip: 'branch name',
    group: 'branch',
  },
  {
    name: 'comments:',
    tip: 'number',
    group: 'count',
  },
  {
    name: 'reactions:',
    tip: 'number',
    group: 'count',
  },
  {
    name: 'interactions:',
    tip: 'number',
    group: 'count',
  },
]

class FilterSuggester extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value || ''
    this.state = {
      value,
      previousValue: value,
      suggestions: [],
    }
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  componentDidMount() {
    const input = document.getElementById(this.props.inputID)
    input.addEventListener('keypress', this.onKeyPress)
    input.addEventListener('keyup', this.onKeyUp)
  }

  componentWillUnmount() {
    const input = document.getElementById(this.props.inputID)
    input.removeEventListener('keypress', this.onKeyPress)
    input.removeEventListener('keyup', this.onKeyUp)
  }

  onChange(event, { newValue }) {
    const previousValue = this.state.value
    this.setState({ value: newValue, previousValue })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.state.suppressSubmit) {
      event.preventDefault()
    }
  }

  onKeyUp(event) {
    if (event.key === 'Escape') {
      this.setState({ value: this.state.previousValue, suggestions: [] })
    }
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({ suggestions: this.getSuggestions(value) })
  }

  onSuggestionSelected(event, { method }) {
    this.setState({ suppressSubmit: method === 'enter' })
  }

  getSuggestions(rawValue) {
    const value = rawValue.trim().toLowerCase()
    if (value.length < 1) {
      return filters
    }
    const segments = value.split(/\s+/)
    const lastValue = segments[segments.length - 1].replace(/^-/, '')
    let length = lastValue.length
    if (length < 1) {
      return filters
    }
    if (lastValue.match(/:$/)) {
      const filter = filters.filter(s => s.name === lastValue)[0]
      if (filter && typeof filter.suggestions === 'object') {
        return filter.suggestions
      }
    }
    const trailingWhitespace = rawValue.match(/\s+$/)
    if (trailingWhitespace !== null) {
      return filters
    }
    const colonIndex = lastValue.indexOf(':')
    if (colonIndex > -1) {
      const name = lastValue.slice(0, colonIndex + 1)
      const filter = filters.filter(s => s.name === name)[0]
      if (filter && typeof filter.suggestions === 'object') {
        const lastFilterValue = lastValue.slice(colonIndex + 1)
        length = lastFilterValue.length
        return filter.suggestions.filter(s =>
          s.name.slice(0, length) === lastFilterValue
        )
      }
    }
    return filters.filter(s => s.name.slice(0, length) === lastValue)
  }

  getSuggestionValue(filter) {
    const segments = this.state.value.split(/\s+/)
    if (segments.length === 1) {
      if (typeof filter.prefix === 'string') {
        return `${filter.prefix}${filter.name}`
      }
      return filter.name
    }
    const lastValue = segments[segments.length - 1]
    const priorQuery = segments.slice(0, segments.length - 1).join(' ')
    let newSuggestion = filter.name
    if (typeof filter.prefix === 'string') {
      newSuggestion = `${filter.prefix}${newSuggestion}`
    }
    if (lastValue.indexOf('-') === 0) {
      newSuggestion = `-${newSuggestion}`
    }
    return `${priorQuery} ${newSuggestion}`
  }

  renderSuggestion(suggestion) {
    return (
      <span className="suggestion">
        {typeof suggestion.prefix === 'string' ? (
          <span>
            <span>{suggestion.prefix}</span><strong>{suggestion.name}</strong>
          </span>
        ) : (
          <span>
            <strong>{suggestion.name}</strong> &mdash; {suggestion.tip}
          </span>
        )}
      </span>
    )
  }

  render() {
    const inputProps = {
      placeholder: 'e.g., team:org/team-name is:open sort:updated-desc',
      value: this.state.value,
      onChange: (e, props) => this.onChange(e, props),
      name: 'filterValue',
      className: this.props.className || '',
      id: this.props.inputID,
      onBlur: () => { this.setState({ suggestions: [] }) },
    }
    let previousGroup = filters[0].group
    return (
      <div className="filter-suggester-container">
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={p => this.onSuggestionsFetchRequested(p)}
          getSuggestionValue={f => this.getSuggestionValue(f)}
          renderSuggestion={filter => this.renderSuggestion(filter)}
          inputProps={inputProps}
          alwaysRenderSuggestions
          onSuggestionSelected={(e, p) => this.onSuggestionSelected(e, p)}
        />
        {this.state.showFilterHelp ? (
          <div className="card suggestions-container">
            <div className="card-content">
              <h3 className="card-header-title">Refine your filter:</h3>
              <ul className="suggestions-list">
                {filters.map(filter => {
                  let className = 'suggestion'
                  if (filter.group !== previousGroup) {
                    className += ' first-in-section'
                  }
                  previousGroup = filter.group
                  return (
                    <li key={filter.name} className={className}>
                      <strong>{filter.name}</strong> &mdash; {filter.tip}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : ''}
      </div>
    )
  }
}

FilterSuggester.propTypes = {
  className: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  inputID: React.PropTypes.string.isRequired,
}

module.exports = FilterSuggester
