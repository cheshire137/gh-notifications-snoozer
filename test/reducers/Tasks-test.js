const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('uses an empty list as the initial state')

  it('TASKS_UPDATE', () => {
    const initialState = [
      { id: 1, title: 'task' },
      { id: 2, title: 'more task' },
    ]

    const updatedTasks = [
      { id: 2, title: 'updated title' },
      { id: 3, title: 'new task' },
    ]

    const store = Redux.createStore(reducer, initialState)
    store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

    const expectedState = [
      { id: 1, title: 'task', state: 'closed' },
      { id: 2, title: 'updated title' },
      { id: 3, title: 'new task' },
    ]

    assert.deepEqual(expectedState, store.getState())
  })
})
