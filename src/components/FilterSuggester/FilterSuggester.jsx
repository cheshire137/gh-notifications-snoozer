const React = require('react')
const Autosuggest = require('react-autosuggest')

const filters = [
  {
    name: 'type:',
    tip: 'issue, pr',
    suggestions: [
      { name: 'issue', prefix: 'type:' },
      { name: 'pr', prefix: 'type:' },
    ],
  },
  {
    name: 'in:',
    tip: 'title, body, comments',
    suggestions: [
      { name: 'title', prefix: 'in:' },
      { name: 'body', prefix: 'in:' },
      { name: 'comments', prefix: 'in:' },
    ],
  },
  {
    name: 'state:',
    tip: 'open, closed',
    suggestions: [
      { name: 'open', prefix: 'state:' },
      { name: 'closed', prefix: 'state:' },
    ],
  },
  {
    name: 'label:',
    tip: 'label name',
  },
  {
    name: 'is:',
    tip: 'open, closed, merged',
    suggestions: [
      { name: 'open', prefix: 'is:' },
      { name: 'closed', prefix: 'is:' },
      { name: 'merged', prefix: 'is:' },
    ],
  },
  {
    name: 'no:',
    tip: 'label, milestone, assignee',
    suggestions: [
      { name: 'label', prefix: 'no:' },
      { name: 'milestone', prefix: 'no:' },
      { name: 'assignee', prefix: 'no:' },
    ],
  },
  {
    name: 'language:',
    tip: 'language name',
  },
  {
    name: 'status:',
    tip: 'pending, failure, success',
    suggestions: [
      { name: 'pending', prefix: 'status:' },
      { name: 'failure', prefix: 'status:' },
      { name: 'success', prefix: 'status:' },
    ],
  },
  {
    name: 'sort:',
    tip: 'comments, created, updated, reactions, interactions',
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
  },
  {
    name: 'author:',
    tip: 'username',
  },
  {
    name: 'assignee:',
    tip: 'username',
  },
  {
    name: 'mentions:',
    tip: 'username',
  },
  {
    name: 'commenter:',
    tip: 'username',
  },
  {
    name: 'involves:',
    tip: 'username',
  },
  {
    name: 'team:',
    tip: 'team name',
  },
  {
    name: 'user:',
    tip: 'username',
  },
  {
    name: 'org:',
    tip: 'organization name',
  },
  {
    name: 'repo:',
    tip: 'user/repo or org/repo',
  },
  {
    name: 'created:',
    tip: 'date',
  },
  {
    name: 'updated:',
    tip: 'date',
  },
  {
    name: 'closed:',
    tip: 'date',
  },
  {
    name: 'merged:',
    tip: 'date',
  },
  {
    name: 'head:',
    tip: 'branch name',
  },
  {
    name: 'base:',
    tip: 'branch name',
  },
  {
    name: 'comments:',
    tip: 'number',
    suggestions: [
      { name: '', prefix: 'comments:', tip: 'number' },
      { name: '>', prefix: 'comments:', tip: 'number' },
      { name: '<', prefix: 'comments:', tip: 'number' },
      { name: '>=', prefix: 'comments:', tip: 'number' },
      { name: '<=', prefix: 'comments:', tip: 'number' },
    ],
  },
  {
    name: 'reactions:',
    tip: 'number',
    suggestions: [
      { name: '', prefix: 'reactions:', tip: 'number' },
      { name: '>', prefix: 'reactions:', tip: 'number' },
      { name: '<', prefix: 'reactions:', tip: 'number' },
      { name: '>=', prefix: 'reactions:', tip: 'number' },
      { name: '<=', prefix: 'reactions:', tip: 'number' },
    ],
  },
  {
    name: 'interactions:',
    tip: 'number',
    suggestions: [
      { name: '', prefix: 'interactions:', tip: 'number' },
      { name: '>', prefix: 'interactions:', tip: 'number' },
      { name: '<', prefix: 'interactions:', tip: 'number' },
      { name: '>=', prefix: 'interactions:', tip: 'number' },
      { name: '<=', prefix: 'interactions:', tip: 'number' },
    ],
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
    if (input) {
      input.addEventListener('keypress', this.onKeyPress)
      input.addEventListener('keyup', this.onKeyUp)
    }
  }

  componentWillUnmount() {
    const input = document.getElementById(this.props.inputID)
    if (input) {
      input.removeEventListener('keypress', this.onKeyPress)
      input.removeEventListener('keyup', this.onKeyUp)
    }
  }

  onChange(event, { newValue }) {
    const previousValue = this.state.value
    this.setState({ value: newValue, previousValue })
    if (this.props.onChange) {
      this.props.onChange(newValue)
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
            <span className="prefix">{suggestion.prefix}</span>
            <strong className="name">{suggestion.name}</strong>
            {typeof suggestion.tip === 'string' ? (
              <span> &mdash; {suggestion.tip}</span>
            ) : ''}
          </span>
        ) : (
          <span>
            <strong className="name">
              {suggestion.name}
            </strong> &mdash; {suggestion.tip}
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
