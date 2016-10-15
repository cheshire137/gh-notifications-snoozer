const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')
const GitHub = require('../../src/models/GitHub')
const GitHubAuth = require('../../src/models/GitHubAuth')
const Filter = require('../../src/models/Filter')
const LastFilter = require('../../src/models/LastFilter')
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
      fetchMock.mock('*', {})
    })

    after(() => {
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
      GitHubAuth.deleteToken()

      renderPage(store)

      const fetchedCalls = fetchMock.calls().matched
      assert.equal(0, fetchedCalls.length, 'No fetch calls should be made.')
    })

    it('fetches user when auth token is set', () => {
      GitHubAuth.setToken('test-whee')

      renderPage(store)

      const fetchedCalls = fetchMock.calls().matched
      assert.equal(1, fetchedCalls.length, 'Only one fetch call should be made')
      assert(fetchedCalls[0][0].match(/\/user/),
             'Fetch call should be to the user API')
    })
  })

  describe('when valid auth token is set', () => {
    let getNotifications

    before(() => {
      store = Redux.createStore(reducer)
      GitHubAuth.setToken('test-whee')
      getNotifications = GitHub.prototype.getNotifications
      GitHub.prototype.getNotifications = function() {
        return Promise.resolve([])
      }
      fetchMock.get(`${Config.githubApiUrl}/user`, { login: 'testuser123' })
      fetchMock.get(`${Config.githubApiUrl}/search/issues?q=cats`, [])
    })

    after(() => {
      GitHub.prototype.getNotifications = getNotifications
      fetchMock.restore()
    })

    it('fetches user and issues when filter exists', done => {
      const filter = new Filter('Cool name')
      filter.store('cats')
      LastFilter.save('Cool name')

      renderPage(store)

      setTimeout(() => {
        const fetchedCalls = fetchMock.calls().matched
        console.log('fetchedCalls', fetchedCalls)
        assert(fetchedCalls[0][0].match(/\/user/),
               'Fetch call should be to the user API')
        assert(fetchedCalls[1][0].match(/\/search\/issues/),
               'Fetch call should be to the search issues API')
        done()
      }, 500)
    })
  })
})
