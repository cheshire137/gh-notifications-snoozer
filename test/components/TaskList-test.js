const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')

const TaskList = require('../../components/TaskList')
const reducer = require('../../reducers/reducer')

describe('TaskList', function() {
  it('doesn\'t show tasks that were ignored', function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    const DEFAULT_TASKS = [
      {id: 1, title: "this is a task" },
      {id: 2, title: "this is also a task" },
      {id: 3, title: "ignore this one", ignore: true }
    ]
    const store = Redux.createStore(reducer, DEFAULT_TASKS)
    const appComponent = TestUtils.renderIntoDocument(<TaskList store={store}/>)
    const element = ReactDOM.findDOMNode(appComponent)
    assert(element)

    assert.equal(2, element.querySelectorAll("li").length)
  })
})
