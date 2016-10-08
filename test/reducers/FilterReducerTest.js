const assert = require('assert')
const Redux = require('redux')

const FiltersReducer = require('../../src/reducers/FiltersReducer')

describe.only('Filters reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(FiltersReducer)
    assert.deepEqual({ }, store.getState())
  })

  describe('FILTERS_UPDATE', () => {
    it('adds a filter', () => {
      const initialFilters = { 'first filter': { query: 'label:first' } }
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({ type: 'FILTERS_UPDATE', name: 'new filter', query: 'label:new' })
      const expectedFilters = {
        'first filter': { query: 'label:first' },
        'new filter': { query: 'label:new' },
      }

      assert.deepEqual(expectedFilters, store.getState())
    })

    it('updates an existing filter', () => {
      const initialFilters = { 'first filter': { query: 'label:first' } }
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({ type: 'FILTERS_UPDATE', name: 'first filter', query: 'label:updated' })
      const expectedFilters = {
        'first filter': { query: 'label:updated' },
      }

      assert.deepEqual(expectedFilters, store.getState())
    })
  })

  describe('FILTERS_REMOVE', () => {
    it('removes a filter', () => {
      const initialFilters = { 'first filter': { query: 'label:first' } }
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({ type: 'FILTERS_REMOVE', name: 'first filter' })
      assert.deepEqual({ }, store.getState())
    })
  })

  describe('FILTERS_SELECT', () => {
    it('selects a filter', () => {
      const initialFilters = {
        'first filter': { query: 'label:first', selected: true },
        'second filter': { query: 'label:second', selected: false },
      }
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({ type: 'FILTERS_SELECT', name: 'second filter' })
      const expectedFilters = {
        'first filter': { query: 'label:first', selected: false },
        'second filter': { query: 'label:second', selected: true },
      }
      assert.deepEqual(expectedFilters, store.getState())
    })
  })
})
