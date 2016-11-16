const assert = require('assert')
const Redux = require('redux')

const reducer = require('../../src/reducers/reducer')

describe('Reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [], filters: [] }, store.getState())
  })
})
