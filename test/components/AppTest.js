const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const simple = require('simple-mock')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')
const GitHubAuth = require('../../src/models/GitHubAuth')
const Config = require('../../src/config.json')

function renderPage(store) {
  return TestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <App />
    </ReactRedux.Provider>
  )
}

describe('App', () => {
  let store

  describe('when valid auth token is not set', () => {
    before(() => {
      store = Redux.createStore(reducer)
      simple.mock(GitHubAuth, 'getToken').returnWith(null)
      fetchMock.mock('*', {})
    })

    after(() => {
      simple.restore()
      fetchMock.restore()
    })

    it('renders', () => {
      const appComponent = renderPage(store)
      assert(ReactDOM.findDOMNode(appComponent))
    })

    it('has a tabbed nav', () => {
      const appComponent = renderPage(store)
      const app = ReactDOM.findDOMNode(appComponent)
      assert(app.querySelector('#tabbed-nav'))
    })

    it('does not make request without a token', () => {
      renderPage(store)

      const fetchedCalls = fetchMock.calls().matched
      assert.equal(0, fetchedCalls.length, 'No fetch calls should be made.')
    })
  })

  describe('when valid auth token is set', () => {
    before(() => {
      store = Redux.createStore(reducer)
      simple.mock(GitHubAuth, 'getToken').returnWith('test-whee')
      fetchMock.get(`${Config.githubApiUrl}/user`, { login: 'testuser123' })
      fetchMock.get(`${Config.githubApiUrl}/search/issues?per_page=30&q=cats`, [])
    })

    after(() => {
      fetchMock.restore()
      simple.restore()
    })

    it('fetches user when auth token is set', () => {
      renderPage(store)

      const fetchedCalls = fetchMock.calls().matched
      assert.equal(1, fetchedCalls.length, 'Only one fetch call should be made')
      assert(fetchedCalls[0][0].match(/\/user/),
             'Fetch call should be to the user API')
    })
  })
})
