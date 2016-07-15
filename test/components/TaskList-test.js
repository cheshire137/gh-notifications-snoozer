const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')

const TaskList = require('../../components/TaskList')
const reducer = require('../../reducers/reducer')

describe('TaskList', function() {
  let store

  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    const initialState = []
    store = Redux.createStore(reducer, initialState)
  })

  it('renders', function() {
    const appComponent = TestUtils.renderIntoDocument(<TaskList store={store}/>)
    assert(ReactDOM.findDOMNode(appComponent))
  })
})
