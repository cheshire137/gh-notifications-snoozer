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

  it('makes suggestions based on input', () => {
    assert.equal(0, renderedDOM().querySelectorAll('.suggestion').length)

    const input = renderedDOM().querySelector('input#test-filter')
    input.value = 'st'
    TestUtils.Simulate.change(input)

    const suggestions = renderedDOM().querySelectorAll('.suggestion')
    assert.equal(2, suggestions.length)
    assert.equal('state:', suggestions[0].querySelector('.name').textContent)
    assert.equal('status:', suggestions[1].querySelector('.name').textContent)
  })

  it('suggests values for filters', () => {
    const input = renderedDOM().querySelector('input#test-filter')
    input.value = 'is:'
    TestUtils.Simulate.change(input)

    const suggestions = renderedDOM().querySelectorAll('.suggestion')
    assert.equal(3, suggestions.length)
    assert.equal('is:', suggestions[0].querySelector('.prefix').textContent)
    assert.equal('open', suggestions[0].querySelector('.name').textContent)
    assert.equal('is:', suggestions[1].querySelector('.prefix').textContent)
    assert.equal('closed', suggestions[1].querySelector('.name').textContent)
    assert.equal('is:', suggestions[2].querySelector('.prefix').textContent)
    assert.equal('merged', suggestions[2].querySelector('.name').textContent)
  })
})
