const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('uses an empty list as the initial state')

  it('TASKS_UPDATE', () => {
    const initialState = {
      1: { title: 'task' },
      2: { title: 'more task' },
    }

    const updatedTasks = {
      2: { title: 'updated title' },
      3: { title: 'new task' },
    }

    const store = Redux.createStore(reducer, initialState)
    store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

    const expectedState = {
      1: { title: 'task' },
      2: { title: 'updated title' },
      3: { title: 'new task' },
    }

    assert.deepEqual(expectedState, store.getState())
  })
})
