const assert = require('assert')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')

const TaskList = require('../../src/components/TaskList')
const reducer = require('../../src/reducers/reducer')

describe('TaskList', () => {
  let element
  let taskListComponent
  const msecsInDay = 1000 * 60 * 60 * 24
  const today = new Date()
  const yesterday = new Date(today - msecsInDay)
  const defaultTasks = [
    { id: 1, title: 'this is a task' },
    { id: 2, title: 'this is also a task' },
    { id: 3, title: 'ignore this one', ignore: true },
    { id: 4, title: 'this one is archived', archivedAt: today, updatedAt: yesterday },
    { id: 5, title: 'this one is snoozed', snooze: true },
  ]
  const store = Redux.createStore(reducer, defaultTasks)

  before(() => {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView

    taskListComponent = TestUtils.renderIntoDocument(
      <ReactRedux.Provider store={store}>
        <TaskList />
      </ReactRedux.Provider>
    )
    element = ReactDOM.findDOMNode(taskListComponent)

    assert(element)
  })

  it('does not show tasks that are ignored, archived or snoozed', () => {
    assert.equal(2, element.querySelectorAll('li').length)
  })

  it('unarchives a task if the takes has updates', () => {
    const tasks = defaultTasks.map(task => {
      return Object.assign({}, task, { updateAt: new Date() })
    })

    store.dispatch({ type: 'TASKS_UPDATE', tasks })
    assert.equal(3, element.querySelectorAll('li').length)
  })

  context('when the snooze button is pressed', () => {
    it('snoozes the selected tasks', () => {
      const snoozeButton = element.querySelector('button#snooze')
      const firstCheckbox = element.querySelector('li input[type=checkbox]')
      firstCheckbox.checked = true

      TestUtils.Simulate.click(snoozeButton)

      assert.equal(2, element.querySelectorAll('li').length)
    })
  })
})
