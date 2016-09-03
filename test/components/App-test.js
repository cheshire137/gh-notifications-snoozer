const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')

describe('App', () => {
  let store

  before(() => {
    store = Redux.createStore(reducer)
    fetchMock.mock('*', {})
  })

  after(() => {
    fetchMock.restore()
  })

  it('renders', () => {
    const appComponent = TestUtils.renderIntoDocument(
      <ReactRedux.Provider store={store}>
        <App />
      </ReactRedux.Provider>
    )

    assert(ReactDOM.findDOMNode(appComponent))

    const fetchedCalls = fetchMock.calls().matched
    assert.equal(1, fetchedCalls.length, 'Only one fetch call should be made.')
    assert(fetchedCalls[0][0].match(/\/search\/issues\?/), 'It should be to the search API')
  })
})
