const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const fetchMock = require('fetch-mock')
const TestUtils = require('react-addons-test-utils')
const NewFilter = require('../../src/components/NewFilter')
const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })
const reducer = require('../../src/reducers/reducer')

function renderPage(store) {
  // NewFilter calls loadFilter and save functions from the main App onSubmit.
  return TestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <NewFilter
        loadFilter={key => key}
        save={() => 'saved'}
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
    const newFilterForm = renderedDOM().querySelectorAll('.new-filter-form')
    assert.equal(1, newFilterForm.length)
  })

  describe('Create', () => {
    it('has a save button', () => {
      const saveButton = renderedDOM().querySelector('#new-filter-save')
      assert(saveButton)
    })

    it('has required form fields', () => {
      const valueInput = renderedDOM().querySelector("input[name='filterValue']")
      assert(valueInput)
    })

    it('sets a created filter as LastFilter', () => {
      const filterForm = renderedDOM().querySelector('form.new-filter-form')
      const valueInput = renderedDOM().querySelector("input[name='filterValue']")
      const filter = 'author:LuluPopplewell'

      valueInput.value = filter
      TestUtils.Simulate.change(valueInput)
      TestUtils.Simulate.submit(filterForm)
      assert.equal(storage.get(filter), 'author:LuluPopplewell')
    })
  })
})
