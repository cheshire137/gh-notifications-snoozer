const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const FilterSuggester = require('../../src/components/FilterSuggester')
const reducer = require('../../src/reducers/reducer')

function renderPage(store) {
  return TestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <FilterSuggester
        inputID="test-filter"
      />
    </ReactRedux.Provider>
  )
}

describe('FilterSuggester', () => {
  let renderedDOM
  let store

  before(() => {
    store = Redux.createStore(reducer)
    const component = renderPage(store)
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  it('has a text field with given ID', () => {
    const input = renderedDOM().querySelector('input#test-filter[type="text"]')
    assert(input)
  })
})
