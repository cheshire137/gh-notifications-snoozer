const assert = require('assert')

const reducer = require('../../reducers/reducer')

describe('reducers', function() {
  it('uses an empty list as the initial state', function() {
    const defaultValue = reducer(undefined, {})
    assert.deepEqual([], defaultValue)
  })

  it('adds a task', function() {
    const action = {
      type: 'TASK_ADD',
      task : {
        title: 'This is the title'
      }
    }
    const state = reducer(undefined, action)
    assert.deepEqual([action.task], state)
  })
})
