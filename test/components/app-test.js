const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')

const App = require('../../components/App')
const reducer = require('../../reducers/reducer')

describe('App', function() {
  let store

  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    const initialState = []
    store = Redux.createStore(reducer, initialState)
  })

  it('renders', function() {
    const appComponent = TestUtils.renderIntoDocument(
      <ReactRedux.Provider store={store}>
        <App />
      </ReactRedux.Provider>
    )
    assert(ReactDOM.findDOMNode(appComponent))
  })
})