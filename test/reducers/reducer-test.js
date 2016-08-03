const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [] }, store.getState())
  })

  describe('TASKS_UPDATE', () => {
    it('updates existing tasks', () => {
      const now = new Date()
      const initialTasks = [
        { id: 1, title: 'task', updatedAt: now },
        { id: 2, title: 'more task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 1, title: 'task', updatedAt: now },
        { id: 2, title: 'updated title', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, title: 'task', updatedAt: now },
        { id: 2, title: 'updated title', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })

    it('adds new tasks', () => {
      const now = new Date()
      const initialTasks = [
        { id: 1, title: 'task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 2, title: 'new task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, title: 'task', updatedAt: now },
        { id: 2, title: 'new task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })

    it('sorts tasks by updatedAt field', () => {
      const present = new Date()
      const past = new Date() - 10
      const distantPast = new Date() - 20

      const initialTasks = [
        { id: 1, title: 'task', updatedAt: distantPast },
        { id: 2, title: 'old task', updatedAt: distantPast },
      ]

      const updatedTasks = [
        { id: 2, title: 'updated task', updatedAt: present },
        { id: 3, title: 'new task', updatedAt: past },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 2, title: 'updated task', updatedAt: present },
        { id: 3, title: 'new task', updatedAt: past },
        { id: 1, title: 'task', updatedAt: distantPast },

      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })
})
