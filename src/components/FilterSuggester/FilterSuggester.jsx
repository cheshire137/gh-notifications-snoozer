const React = require('react')
const Autosuggest = require('react-autosuggest')

const filters = [
  {
    name: 'type:',
    tip: 'issue, pr',
    group: 'general',
  },
  {
    name: 'in:',
    tip: 'title, body, comments',
    group: 'general',
  },
  {
    name: 'state:',
    tip: 'open, closed',
    group: 'general',
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
  },
  {
    name: 'no:',
    tip: 'label, milestone, assignee',
    group: 'general',
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
  },
  {
    name: 'sort:',
    tip: 'comments, created, updated, reactions, interactions',
    group: 'general',
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
    this.state = { value: props.value || '', suggestions: [] }
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  componentDidMount() {
    const input = document.getElementById(this.props.inputID)
    input.addEventListener('keypress', this.onKeyPress)
  }

  componentWillUnmount() {
    const input = document.getElementById(this.props.inputID)
    input.removeEventListener('keypress', this.onKeyPress)
  }

  onChange(event, { newValue }) {
    this.setState({ value: newValue })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  onFocus() {
    this.setState({ showFilterHelp: true })
  }

  onBlur() {
    this.setState({ showFilterHelp: false })
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.state.suppressSubmit) {
      event.preventDefault()
    }
  }

  onSuggestionsFetchRequested({ value }) {
    const suggestions = this.getSuggestions(value)
    this.setState({
      suggestions,
      showFilterHelp: false,
    })
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
      showFilterHelp: true,
    })
  }

  onSuggestionSelected(event, props) {
    this.setState({ suppressSubmit: props.method === 'enter' })
  }

  getSuggestions(rawValue) {
    const value = rawValue.trim().toLowerCase()
    if (value.length < 1) {
      return []
    }
    const segments = value.split(/\s+/)
    const lastValue = segments[segments.length - 1].replace(/^-/, '')
    const length = lastValue.length
    if (length < 1) {
      return []
    }
    return filters.filter(s => s.name.slice(0, length) === lastValue)
  }

  getSuggestionValue(filter) {
    const segments = this.state.value.split(/\s+/)
    if (segments.length === 1) {
      return filter.name
    }
    const lastValue = segments[segments.length - 1]
    const priorQuery = segments.slice(0, segments.length - 1).join(' ')
    let newSuggestion = filter.name
    if (lastValue.indexOf('-') === 0) {
      newSuggestion = `-${newSuggestion}`
    }
    return `${priorQuery} ${newSuggestion}`
  }

  renderSuggestion(suggestion) {
    return (
      <span className="suggestion">
        <strong>{suggestion.name}</strong> &mdash; {suggestion.tip}
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
      onFocus: () => this.onFocus(),
      onBlur: () => this.onBlur(),
      id: this.props.inputID,
    }
    let previousGroup = filters[0].group
    return (
      <div className="filter-suggester-container">
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={p => this.onSuggestionsFetchRequested(p)}
          onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
          getSuggestionValue={f => this.getSuggestionValue(f)}
          renderSuggestion={filter => this.renderSuggestion(filter)}
          inputProps={inputProps}
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
