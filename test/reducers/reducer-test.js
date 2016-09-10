const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [] }, store.getState())
  })

  describe('TASKS_IGNORE', () => {
    it('ignores selected task', () => {
      const initialTasks = [
        { id: 1, storageKey: 'issue-5', isSelected: true },
        { id: 2, storageKey: 'pull-2' },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_IGNORE' })

      const expectedTasks = [
        { id: 1, storageKey: 'issue-5', isSelected: true, ignore: true },
        { id: 2, storageKey: 'pull-2' },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
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

  describe('TASKS_SNOOZE', () => {})

  describe('TASKS_ARCHIVE', () => {})

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
      const initialTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })

    it('adds new tasks', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, storageKey: 'pull-1', title: 'task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 2, storageKey: 'pull-2', title: 'new task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, storageKey: 'pull-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'new task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })
})
