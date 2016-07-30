const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('has the correctd default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [] }, store.getState())
  })

  it('TASKS_UPDATE', () => {
    const initialTasks = [
      { id: 1, title: 'task' },
      { id: 2, title: 'more task' },
    ]

    const updatedTasks = [
      { id: 2, title: 'updated title' },
      { id: 3, title: 'new task' },
    ]

    const store = Redux.createStore(reducer, { tasks: initialTasks })
    store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

    const expectedTasks = [
      { id: 1, title: 'task', state: 'closed' },
      { id: 2, title: 'updated title' },
      { id: 3, title: 'new task' },
    ]

    assert.deepEqual(expectedTasks, store.getState().tasks)
  })
})