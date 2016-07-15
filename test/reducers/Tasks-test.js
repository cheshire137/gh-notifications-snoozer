const assert = require('assert')

const reducer = require('../../reducers/reducer')

describe('reducers', function() {
  it('uses an empty list as the initial state', function() {
    const defaultValue = reducer(undefined, {})
    assert([], defaultValue)
  })
})
