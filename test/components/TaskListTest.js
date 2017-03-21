const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const simple = require('simple-mock')
const TestUtils = require('react-addons-test-utils')

const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')
const GitHubAuth = require('../../src/models/GitHubAuth')
const fixtures = require('../fixtures')

describe('TaskList', () => {
  let renderedDOM
  let store

  before(() => {
    simple.mock(GitHubAuth, 'getToken').returnWith('test-whee')

    // Setup Redux store and render app
    const filters = [{
      name: 'Cool name',
      query: 'cats',
      selected: true,
      updatedAt: '2017-01-01T01:01:01.000Z',
    }]
    const tasks = [fixtures.task]

    store = Redux.createStore(reducer, { filters, tasks })

    const component = TestUtils.renderIntoDocument(
      <ReactRedux.Provider store={store}>
        <App />
      </ReactRedux.Provider>
    )
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  after(() => {
    simple.restore()
  })

  it('shows task that is not snoozed, archived, or ignored', () => {
    const taskListItems = renderedDOM().querySelectorAll('#pull-163031382')
    assert.equal(1, taskListItems.length)
  })

  it('does not show task that is ignored', () => {
    assert.equal(1, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_IGNORE', task: { storageKey: 'pull-163031382' } })
    assert.equal(0, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_RESTORE', task: { storageKey: 'pull-163031382' } })
  })

  it('does not show task that is archived', () => {
    const filter = { updatedAt: '2017-01-01T01:01:01.000Z' }

    assert.equal(1, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_ARCHIVE', task: { storageKey: 'pull-163031382' }, filter })
    assert.equal(0, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_RESTORE', task: { storageKey: 'pull-163031382' } })
  })

  it('does not show task that is snoozed', () => {
    assert.equal(1, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_SNOOZE', task: { storageKey: 'pull-163031382' } })
    assert.equal(0, renderedDOM().querySelectorAll('#pull-163031382').length)
    store.dispatch({ type: 'TASKS_RESTORE', task: { storageKey: 'pull-163031382' } })
  })

  context('when the snooze button is clicked', () => {
    let snoozeTime

    before(() => {
      TestUtils.Simulate.click(renderedDOM().querySelector('#snooze-button'))
      snoozeTime = new Date()
    })

    it('hides selected tasks', () => {
      const taskListItems = renderedDOM().querySelectorAll('#pull-163031382')
      assert.equal(0, taskListItems.length)
    })

    it("updates the selected task's `snoozedAt` field", () => {
      const task = store.getState().tasks[0]
      assert.equal('string', typeof task.snoozedAt)
    })

    it('shows the tasks again after 24 hours', () => {
      const tasks = store.getState().tasks
      const pastSnooze = new Date()
      pastSnooze.setDate(snoozeTime.getDate() - 10000)
      const updatedTask = Object.assign({}, tasks[0], {
        snoozedAt: pastSnooze.toISOString(),
      })


      store.dispatch({
        type: 'TASKS_UPDATE',
        tasks: [updatedTask],
        filter: 'cats',
      })

      const taskListItems = renderedDOM().querySelectorAll('#pull-163031382')
      assert.equal(1, taskListItems.length)
    })
  })

  context('when the archive button is clicked', () => {
    before(() => {
      TestUtils.Simulate.click(renderedDOM().querySelector('#archive-button'))
    })

    it('hides selected tasks', () => {
      const taskListItems = renderedDOM().querySelectorAll('#pull-163031382')
      assert.equal(0, taskListItems.length)
    })

    it("updates the selected task's `archivedAt` field", () => {
      const task = store.getState().tasks[0]
      assert.equal('string', typeof task.archivedAt)
    })

    it('shows tasks again if `updatedAt` is greater than `archivedAt`', () => {
      const theFuture = new Date(3016, 0, 1)
      const tasks = store.getState().tasks
      const updatedTask = Object.assign({}, tasks[0], {
        updatedAt: theFuture.toISOString(),
        comments: 13,
      })

      store.dispatch({
        type: 'TASKS_UPDATE',
        tasks: [updatedTask],
        filter: 'cats',
      })

      const taskListItems = renderedDOM().querySelectorAll('#pull-163031382')
      assert.equal(1, taskListItems.length)
    })
  })

  context('when the ignore button is clicked', () => {
    it('hides selected tasks')
    it("updates the selected task's `ignored` field")
  })
})
