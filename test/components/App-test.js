const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')
const GitHubAuth = require('../../src/models/github-auth')

function renderPage(store) {
  return TestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <App />
    </ReactRedux.Provider>
  )
}

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
    const appComponent = renderPage(store)
    assert(ReactDOM.findDOMNode(appComponent))
  })

  it('does not make request without a token', () => {
    renderPage(store)

    const fetchedCalls = fetchMock.calls().matched
    assert.equal(0, fetchedCalls.length, 'No fetch calls should be made.')
  })

  it('fetches user when auth token is set', () => {
    GitHubAuth.setToken('test-whee')

    renderPage(store)

    const fetchedCalls = fetchMock.calls().matched
    assert.equal(1, fetchedCalls.length, 'Only one fetch call should be made.')
    assert(fetchedCalls[0][0].match(/\/user/),
           'Fetch call should be to the user API')
  })
})
