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
  const msecsInDay = 1000 * 60 * 60 * 24
  const today = new Date()
  const yesterday = new Date(today - msecsInDay)
  const defaultTasks = [
    {id: 1, title: "this is a task" },
    {id: 2, title: "this is also a task" },
    {id: 3, title: "ignore this one", ignore: true },
    {id: 4, title: "this one is archived", archivedAt: yesterday, updatedAt: yesterday },
    {id: 5, title: "this one is archived", snooze: true }
  ]
  const store = Redux.createStore(reducer, defaultTasks)

  before(function() {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    const appComponent = TestUtils.renderIntoDocument(<TaskList store={store}/>)
    element = ReactDOM.findDOMNode(appComponent)

    assert(element)
  })

  it('do not show tasks that are ignored, archived or snoozed', function() {
    assert.equal(2, element.querySelectorAll("li").length)
  })

  it('shows archived tasks if they have updates', function() {
    const tasks = defaultTasks.map(task => {
      task.updateAt = new Date()
      return task
    })
    store.dispatch({type: 'TASKS_UPDATE', tasks: tasks})
    assert.equal(3, element.querySelectorAll("li").length)
  })
})
