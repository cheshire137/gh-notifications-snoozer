const assert = require('assert')
const Redux = require('redux')

const FiltersReducer = require('../../src/reducers/FiltersReducer')

describe.only('Filters reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(FiltersReducer)
    assert.deepEqual({ }, store.getState())
  })

  describe('FILTERS_ADD', () => {
    it('adds a filter', () => {
      const initialFilters = { 'first filter': 'label:first' }
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({ type: 'FILTERS_ADD', name: 'new filter', query: 'label:new' })
      const expectedFilters = {
        'first filter': 'label:first',
        'new filter': 'label:new',
      }

      assert.deepEqual(expectedFilters, store.getState())
    })
  })
})
