const assert = require('assert')

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('uses an empty list as the initial state', () => {
    const defaultValue = reducer(undefined, {})
    assert.deepEqual([], defaultValue)
  })

  it('TASKS_ADD', () => {
    const action = {
      type: 'TASKS_ADD',
      task: {
        title: 'This is the title',
      },
    }
    const state = reducer(undefined, action)
    assert.deepEqual([action.task], state)
  })
})
