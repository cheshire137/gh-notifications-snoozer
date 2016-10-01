const React = require('react')
const FilterListItem = require('../FilterListItem')
const hookUpStickyNav = require('../hookUpStickyNav')

class FilterList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedIndex: null }
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyUp(event) {
    if (event.key === 'ArrowUp') {
      this.focusPreviousFilter()
    } else if (event.key === 'ArrowDown') {
      this.focusNextFilter()
    } else if (event.key === 'Escape') {
      this.setState({ selectedIndex: null })
    } else if (event.key === 'Enter') {
      if (typeof this.state.selectedIndex === 'number') {
        this.editFocusedFilter()
      }
    }
  }

  onKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }
  }

  editFocusedFilter() {
    const key = this.props.filters[this.state.selectedIndex]
    this.props.edit(key)
  }

  focusPreviousFilter() {
    const oldIndex = this.state.selectedIndex
    const lastIndex = this.props.filters.length - 1
    let newIndex = typeof oldIndex === 'number' ? oldIndex - 1 : lastIndex
    if (newIndex < 0) {
      newIndex = lastIndex
    }
    this.focusFilterAtIndex(newIndex)
  }

  focusNextFilter() {
    const oldIndex = this.state.selectedIndex
    let newIndex = typeof oldIndex === 'number' ? oldIndex + 1 : 0
    if (newIndex > this.props.filters.length - 1) {
      newIndex = 0
    }
    this.focusFilterAtIndex(newIndex)
  }

  focusFilterAtIndex(index) {
    console.info('focus filter', this.props.filters[index])
    this.setState({ selectedIndex: index })
  }

  cancel(event) {
    event.preventDefault()
    this.props.cancel()
  }

  filterListOrMessage() {
    if (this.props.filters.length < 1) {
      return (
        <p>
          You have not added any filters yet. Use filters to manage which
          issues and pull requests are displayed.
        </p>
      )
    }
    return (
      <ul className="filter-list">
        {this.props.filters.map((key, index) => (
          <FilterListItem
            key={key}
            filter={key}
            delete={this.props.delete}
            edit={this.props.edit}
            isFocused={index === this.state.selectedIndex}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div>
        <nav className="nav secondary-nav" id="filter-list-top-navigation">
          <div className="nav-left">
            <h2 className="subtitle nav-item">
              Manage Filters
            </h2>
          </div>
          <div className="nav-right">
            <span className="nav-item">
              <button
                onClick={() => this.props.addFilter()}
                type="button"
                className="button is-link"
                title="Add a filter"
              >
                <span>✳️ Add Filter</span>
              </button>
            </span>
          </div>
        </nav>
        <div className="filter-list-container">
          {this.filterListOrMessage()}
        </div>
      </div>
    )
  }
}

FilterList.propTypes = {
  filters: React.PropTypes.array.isRequired,
  delete: React.PropTypes.func.isRequired,
  edit: React.PropTypes.func.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
}

module.exports = hookUpStickyNav(FilterList, '#filter-list-top-navigation')
