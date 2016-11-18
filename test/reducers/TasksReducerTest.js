const { assert } = require('chai')
const fixtures = require('../fixtures')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('Tasks reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ filters: [], tasks: [] }, store.getState())
  })

  describe('TASKS_SELECT', () => {
    it('selects specified task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: fixtures.task })

      const selectedTask = store.getState().tasks.find(task => task.isSelected)
      const unselectedTask = store.getState().tasks.find(task => !task.isSelected)
      assert.equal(selectedTask.storageKey, fixtures.task.storageKey)
      assert.equal(unselectedTask.storageKey, fixtures.anotherTask.storageKey)
    })
  })

  describe('TASKS_DESELECT', () => {
    it('deselects the specified task', () => {
      const selectedTask = Object.assign({}, fixtures.anotherTask, { isSelected: true })
      const initialTasks = [fixtures.task, selectedTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_DESELECT', task: selectedTask })

      const updatedSelectedTask = store.getState().tasks.find(task => task.isSelected)
      assert.equal(updatedSelectedTask, null)
    })
  })

  describe('TASKS_IGNORE', () => {
    it('ignores selected task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: fixtures.task })
      store.dispatch({ type: 'TASKS_IGNORE' })

      const ignoredTask = store.getState().tasks.find(t => t.ignore)
      const task = store.getState().tasks.find(t => !t.ignore)
      assert.equal(ignoredTask.storageKey, fixtures.task.storageKey)
      assert.equal(task.storageKey, fixtures.anotherTask.storageKey)
    })
  })

  describe('TASKS_SNOOZE', () => {
    it('snoozes selected task', () => {
      const initialTasks = [
        { id: 15, storageKey: 'issue-15' },
        { id: 12, storageKey: 'pull-12', isSelected: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SNOOZE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[1].isSelected, 'task should not be selected')
      assert.equal('string', typeof actual[1].snoozedAt, 'snoozedAt should be a time string')
    })
  })

  describe('TASKS_ARCHIVE', () => {
    it('archives the selected task', () => {
      const initialTasks = [fixtures.task, fixtures.anotherTask]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: fixtures.task })
      store.dispatch({ type: 'TASKS_ARCHIVE' })

      const archivedTask = store.getState().tasks.find(t => t.archivedAt)

      assert(!archivedTask.isSelected, 'archived tasks should not be selected')
      assert.isNotNaN(Date.parse(archivedTask.archivedAt), 'archivedAt should be a string date')
    })

    it('clears changelog when the task is archived', () => {
      const task = Object.assign({}, fixtures.task, { changelog: { comments: 100 } })
      const initialTasks = [task]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: fixtures.task })
      store.dispatch({ type: 'TASKS_ARCHIVE' })

      const archivedTask = store.getState().tasks[0]

      assert.deepEqual(archivedTask.changelog, {})
    })
  })

  describe('TASKS_RESTORE', () => {
    it('restores ignored, selected task', () => {
      const initialTasks = [
        { id: 18, storageKey: 'issue-18', ignore: true, isSelected: true },
        { id: 42, storageKey: 'pull-42', ignore: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[0].ignore, 'selected task should not be ignored')
      assert(actual[1].ignore, 'deselected task should be ignored')
    })

    it('restores archived, selected task', () => {
      const dateStr = new Date().toISOString()

      const initialTasks = [
        {
          id: 99,
          storageKey: 'issue-99',
          archivedAt: dateStr,
          isSelected: true,
        },
        { id: 88, storageKey: 'pull-88', archivedAt: dateStr },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert.equal(null, actual[0].archivedAt, 'selected task should not have archivedAt')
      assert.equal(dateStr, actual[1].archivedAt, 'deselected task should have archivedAt')
    })

    it('restores snoozed, selected task', () => {
      const dateStr = new Date().toISOString()

      const initialTasks = [
        {
          id: 97,
          storageKey: 'issue-97',
          snoozedAt: dateStr,
          isSelected: true,
        },
        { id: 183, storageKey: 'pull-183', snoozedAt: dateStr },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert.equal(null, actual[0].snoozedAt, 'selected task should not have snoozedAt')
      assert.equal(dateStr, actual[1].snoozedAt, 'deselected task should have snoozedAt')
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
