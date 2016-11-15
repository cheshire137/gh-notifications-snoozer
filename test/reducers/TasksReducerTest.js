const assert = require('assert')
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
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: { storageKey: 'pull-2' } })

      const expectedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        {
          id: 2,
          storageKey: 'pull-2',
          title: 'more task',
          updatedAt: now,
          isSelected: true,
        },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })

  describe('TASKS_DESELECT', () => {
    it('deselects the specified task', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: now,
          isSelected: true,
        },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({
        type: 'TASKS_DESELECT',
        task: { storageKey: 'issue-1' },
      })

      const expectedTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: now,
          isSelected: false,
        },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })

  describe('TASKS_IGNORE', () => {
    it('ignores selected task', () => {
      const initialTasks = [
        { id: 5, storageKey: 'issue-5', isSelected: true },
        { id: 2, storageKey: 'pull-2' },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_IGNORE' })

      const expectedTasks = [
        {
          id: 5,
          storageKey: 'issue-5',
          isSelected: false,
          ignore: true,
          archivedAt: null,
          snoozedAt: null,
        },
        { id: 2, storageKey: 'pull-2' },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
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
      assert.equal('string', typeof actual[1].snoozedAt,
                   'snoozedAt should be a time string')
    })
  })

  describe('TASKS_ARCHIVE', () => {
    it('archives the selected task', () => {
      const initialTasks = [
        { id: 35, storageKey: 'issue-35' },
        { id: 22, storageKey: 'pull-22', isSelected: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_ARCHIVE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[1].isSelected, 'task should not be selected')
      assert.equal('string', typeof actual[1].archivedAt,
                   'archivedAt should be a time string')
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
      assert.equal(null, actual[0].archivedAt,
                   'selected task should not have archivedAt')
      assert.equal(dateStr, actual[1].archivedAt,
                   'deselected task should have archivedAt')
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
      assert.equal(null, actual[0].snoozedAt,
                   'selected task should not have snoozedAt')
      assert.equal(dateStr, actual[1].snoozedAt,
                   'deselected task should have snoozedAt')
    })
  })

  describe('TASKS_EMPTY', () => {
    it('empties the tasks list', () => {
      const initialTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: '2016-06-15T20:14:46Z',
        },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_EMPTY' })

      assert.deepEqual([], store.getState().tasks)
    })
  })

  describe('TASKS_UPDATE', () => {
    it('updates existing tasks', () => {
      const now = new Date().toISOString()
      const initialTasks = [fixtures.task]
      const updatedTasks = [Object.assign({}, fixtures.task, { updatedAt: now })]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })
      const { tasks } = store.getState()

      assert.equal(tasks[0].storageKey, fixtures.task.storageKey)
      assert.equal(tasks[0].updatedAt, now)
    })

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

    it('udpates the changelog field when the comment field changes', () => {
      const initialTasks = [fixtures.task]
      const updatedTasks = [Object.assign({}, fixtures.task, { comments: 3 })]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      const query = 'some-filter'
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks, filter: { query } })
      const { tasks } = store.getState()

      assert.deepEqual(tasks[0].changelog, ['comments'])
    })
  })
})
