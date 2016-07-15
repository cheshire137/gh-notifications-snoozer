const assert = require('assert')

const App = require('../../components/App')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')

describe('App', function() {
  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView
  })

  it('renders', function() {
    const appComponent = TestUtils.renderIntoDocument(<App/>)
    assert(ReactDOM.findDOMNode(appComponent))
  })
})
