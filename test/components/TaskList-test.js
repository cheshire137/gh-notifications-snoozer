const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')

const TaskList = require('../../components/TaskList')
const reducer = require('../../reducers/reducer')

describe('TaskList', function() {
  let element

  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    const DEFAULT_TASKS = [
      {id: 1, title: "this is a task" },
      {id: 2, title: "this is also a task" },
      {id: 3, title: "ignore this one", ignore: true },
      {id: 4, title: "this one is archived", archived: true }
    ]
    const store = Redux.createStore(reducer, DEFAULT_TASKS)
    const appComponent = TestUtils.renderIntoDocument(<TaskList store={store}/>)
    element = ReactDOM.findDOMNode(appComponent)

    assert(element)
  })

  it('do not show tasks that are ignored', function() {
    assert.equal(2, element.querySelectorAll("li").length)
  })

  it('XXXdo not show tasks that are archived', function() {
    assert.equal(2, element.querySelectorAll("li").length)
  })
})
