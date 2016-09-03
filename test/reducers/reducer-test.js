const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [] }, store.getState())
  })

  describe('TASKS_SELECT', () => {})

  describe('TASKS_DESELECT', () => {})

  describe('TASKS_SNOOZE', () => {})

  describe('TASKS_ARCHIVE', () => {})

  describe('TASKS_EMPTY', () => {
    it('empties the tasks list', () => {
      const initialTasks = [
        {
          id: 1,
          key: 'issue-1',
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
        { id: 1, key: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, key: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 1, key: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, key: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, key: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, key: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })

    it('adds new tasks', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, key: 'pull-1', title: 'task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 2, key: 'pull-2', title: 'new task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, key: 'pull-1', title: 'task', updatedAt: now },
        { id: 2, key: 'pull-2', title: 'new task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })
})
