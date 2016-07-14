const assert = require('assert')

const Main = require('../../components/main/main')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')

describe('Main', function() {
  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView
  })

  it('renders', function() {
    const mainComponent = TestUtils.renderIntoDocument(<Main/>)
    assert(ReactDOM.findDOMNode(mainComponent))
  })
})
