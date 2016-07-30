const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')
const Config = require('../../src/config.json')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')

describe('App', () => {
  let store

  before(() => {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    store = Redux.createStore(reducer)
    fetchMock.get(`${Config.githubApiUrl}/notifications`, [])
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
  })
})
