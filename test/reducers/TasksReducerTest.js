const { assert } = require('chai')
const fixtures = require('../fixtures')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('Tasks reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ filters: [], tasks: [] }, store.getState())
  })

  describe('TASKS_IGNORE', () => {
    it('ignores selected task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_IGNORE', task: fixtures.task })

      const ignoredTask = store.getState().tasks.find(t => t.ignore)
      const task = store.getState().tasks.find(t => !t.ignore)
      assert.equal(ignoredTask.storageKey, fixtures.task.storageKey)
      assert.equal(task.storageKey, fixtures.anotherTask.storageKey)
    })
  })

  describe('TASKS_SNOOZE', () => {
    it('snoozes selected task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]
      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SNOOZE', task: fixtures.task })

      const snoozedTask = store.getState().tasks.find(t => t.snoozedAt)
      assert.isNotNaN(Date.parse(snoozedTask.snoozedAt), 'snoozedTask should be a string date')
    })
  })

  describe('TASKS_ARCHIVE', () => {
    it('archives the selected task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const filter = { updatedAt: '2015-01-01T01:01:01.000Z' }
      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_ARCHIVE', task: fixtures.task, filter })

      const archivedTask = store.getState().tasks.find(t => t.archivedAt)
      assert.isNotNaN(Date.parse(archivedTask.archivedAt), 'archivedAt should be a string date')
    })

    it('uses the filter\'s updatedAt date as the archivedAt date', () => {
      // Since the issue could have been updated between the time it was updated
      // and when they press archive, it should only archive it at the last updated time
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const filter = { updatedAt: '2015-01-01T01:01:01.000Z' }
      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_ARCHIVE', task: fixtures.task, filter })

      const archivedTask = store.getState().tasks.find(t => t.archivedAt)
      assert.equal(archivedTask.archivedAt, filter.updatedAt)
    })

    it('clears changelog when the task is archived', () => {
      const task = Object.assign({}, fixtures.task, { changelog: { comments: 100 } })
      const initialTasks = [task]

      const filter = { updatedAt: '2015-01-01T01:01:01.000Z' }
      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_ARCHIVE', task, filter })

      const archivedTask = store.getState().tasks[0]

      assert.deepEqual(archivedTask.changelog, {})
    })
  })

  describe('TASKS_RESTORE', () => {
    it('restores ignored task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask].map(task => {
        const updatedTask = Object.assign({}, task, { ignore: true })
        return updatedTask
      })

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE', task: initialTasks[0] })

      const { tasks } = store.getState()
      assert.isFalse(tasks[0].ignore, 'specified task should be un-ignored')
      assert.isTrue(tasks[1].ignore, 'unspecified task should still be ignored')
    })

    it('restores archived task', () => {
      const archivedAt = new Date().toISOString()
      const initialTasks = [fixtures.task, fixtures.anotherTask].map(task => {
        const updatedTask = Object.assign({}, task, { archivedAt })
        return updatedTask
      })

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE', task: initialTasks[0] })

      const { tasks } = store.getState()
      assert.isNull(tasks[0].archivedAt, 'specified task should be un-archived')
      assert.equal(tasks[1].archivedAt, archivedAt, 'unspecified task should still be archived')
    })

    it('restores snoozed task', () => {
      const snoozedAt = new Date().toISOString()
      const initialTasks = [fixtures.task, fixtures.anotherTask].map(task => {
        const updatedTask = Object.assign({}, task, { snoozedAt })
        return updatedTask
      })

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE', task: initialTasks[0] })

      const { tasks } = store.getState()
      assert.isNull(tasks[0].snoozedAt, 'specified task should be un-snoozed')
      assert.equal(tasks[1].snoozedAt, snoozedAt, 'unspecified task should still be snoozed')
    })
  })

  describe('TASKS_UPDATE', () => {
    it('adds new tasks', () => {
      const initialTasks = [fixtures.task]
      const updatedTasks = [fixtures.anotherTask, fixtures.task]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert(tasks.find(task => task.storageKey === fixtures.task.storageKey))
      assert(tasks.find(task => task.storageKey === fixtures.anotherTask.storageKey))
    })

    it('updates the changelog field when the comment count changes', () => {
      const initialTasks = [fixtures.task]
      const updates = { comments: 3 }
      const updatedTasks = [Object.assign({}, fixtures.task, updates)]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.deepEqual(tasks[0].changelog, { comments: 1 })
    })

    it('changes the updatedAt field when the comment count changes', () => {
      const now = new Date().toISOString()
      const initialTasks = [fixtures.task]
      const updates = { comments: 3, updatedAt: now }
      const updatedTasks = [Object.assign({}, fixtures.task, updates)]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.equal(tasks[0].updatedAt, now)
    })

    it('updates the changelog field when the state field changes', () => {
      const initialTasks = [fixtures.task]
      const updates = { state: 'closed' }
      const updatedTasks = [Object.assign({}, fixtures.task, updates)]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.deepEqual(tasks[0].changelog, { state: 'open' })
    })

    it('changes the updatedAt field when the state field changes', () => {
      const now = new Date().toISOString()
      const initialTasks = [fixtures.task]
      const updates = { state: 'closed', updatedAt: now }
      const updatedTasks = [Object.assign({}, fixtures.task, updates)]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.equal(tasks[0].updatedAt, now)
    })

    it('maintains existing changelog values when the task changes', () => {
      const changelog = { changelog: { state: 'closed' } }
      const initialTasks = [Object.assign({}, fixtures.task, changelog)]
      const updates = { comments: 3 }
      const updatedTasks = [Object.assign({}, fixtures.task, updates)]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.deepEqual(tasks[0].changelog, { comments: 1, state: 'closed' })
    })

    it('does not update the changelog for new tasks', () => {
      const initialTasks = []
      const updatedTasks = [fixtures.task]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.deepEqual(tasks[0].changelog, {})
    })

    it('does not change the updatedAt field if the body is updated', () => {
      const originalUpdatedAt = fixtures.task.updatedAt
      const now = new Date().toISOString()
      const initialTasks = [fixtures.task]
      const updatedTasks = [Object.assign({}, fixtures.task, { body: 'new body', updatedAt: now })]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })

      const { tasks } = store.getState()
      assert.equal(tasks[0].updatedAt, originalUpdatedAt)
    })
  })

  describe('TASKS_CLEAR_CHANGELOG', () => {
    it('clears the changelog', () => {
      const task = Object.assign({}, fixtures.task, { changelog: { comments: 100 } })
      const initialTasks = [task, fixtures.anotherTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_CLEAR_CHANGELOG', task })

      const updatedTask = store.getState().tasks.find(t => task.storageKey === t.storageKey)
      assert.deepEqual(updatedTask.changelog, {})
    })
  })
})
