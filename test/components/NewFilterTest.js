const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const fetchMock = require('fetch-mock')
const TestUtils = require('react-addons-test-utils')
const NewFilter = require('../../src/components/NewFilter')
const reducer = require('../../src/reducers/reducer')

function renderPage(store) {
  // NewFilter calls loadFilter and save functions from the main App onSubmit.
  return TestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <NewFilter
        loadFilter={key => key}
        save={() => 'saved'}
        cancel={() => 'cancel'}
      />
    </ReactRedux.Provider>
  )
}

describe('NewFilter', () => {
  let renderedDOM
  let store

  before(() => {
    store = Redux.createStore(reducer)
    fetchMock.mock('*', {})
    const component = renderPage(store)
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  after(() => {
    fetchMock.restore()
  })

  it('shows the form', () => {
    const newFilterForm = renderedDOM().querySelector('.new-filter-form')
    assert(newFilterForm)
  })

  describe('Create', () => {
    it('has a save button', () => {
      const saveButton = renderedDOM().querySelector('button[type="submit"]')
      assert(saveButton)
    })

    it('has required form fields', () => {
      const valueInput = renderedDOM().querySelector("input[name='filterValue']")
      assert(valueInput)
    })

    it('the new filter becomes the active filter', () => {
      const filterForm = renderedDOM().querySelector('form.new-filter-form')
      const valueInput = renderedDOM().querySelector("input[name='filterValue']")
      const value = 'author:LuluPopplewell'

      valueInput.value = value
      TestUtils.Simulate.change(valueInput)
      TestUtils.Simulate.submit(filterForm)
      const activeFilter = store.getState().filters.find(filter => filter.selected)
      assert.equal('author:LuluPopplewell', activeFilter.query)
    })
  })
})
