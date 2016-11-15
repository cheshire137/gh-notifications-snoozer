const assert = require('assert')
const Redux = require('redux')

const FiltersReducer = require('../../src/reducers/FiltersReducer')

describe('Filters reducer', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(FiltersReducer)
    assert.deepEqual([], store.getState())
  })

  describe('FILTERS_UPDATE', () => {
    it('adds a filter', () => {
      const initialFilters = [{ name: 'first filter', query: 'label:first', selected: true }]
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_UPDATE',
        filter: {
          name: 'new filter', query: 'label:new',
        },
      })

      const expectedFilters = [
        { name: 'first filter', query: 'label:first', selected: true },
        { name: 'new filter', query: 'label:new' },
      ]

      assert.deepEqual(expectedFilters, store.getState())
    })

    it('the first filter added is automatically selected', () => {
      const initialFilters = []
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_UPDATE',
        filter: {
          name: 'new filter', query: 'label:new',
        },
      })

      const expectedFilters = [
        { name: 'new filter', query: 'label:new', selected: true },
      ]

      assert.deepEqual(expectedFilters, store.getState())
    })

    it('updates an existing filter', () => {
      const initialFilters = [{ name: 'first filter', query: 'label:first', selected: true }]
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_UPDATE',
        filter: {
          name: 'first filter', query: 'label:updated', updatedAt: '2014-06-11T16:48:20Z',
        },
      })

      const expectedFilters = [{
        name: 'first filter',
        query: 'label:updated',
        updatedAt: '2014-06-11T16:48:20Z',
        selected: true,
      }]

      assert.deepEqual(expectedFilters, store.getState())
    })
  })

  describe('FILTERS_REMOVE', () => {
    it('removes a filter', () => {
      const initialFilters = [{ name: 'first filter', query: 'label:first' }]
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_REMOVE',
        filter: {
          name: 'first filter',
        },
      })

      assert.deepEqual([], store.getState())
    })

    it('sets another filter as selected if the selected filter is removed', () => {
      const initialFilters = [
        { name: 'first filter', query: 'label:first', selected: true },
        { name: 'second filter', query: 'label:second' },
      ]
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_REMOVE',
        filter: {
          name: 'first filter',
        },
      })

      const expectedFilters = [
        { name: 'second filter', query: 'label:second', selected: true },
      ]
      assert.deepEqual(expectedFilters, store.getState())
    })
  })

  describe('FILTERS_SELECT', () => {
    it('selects a filter', () => {
      const initialFilters = [
        { name: 'first filter', query: 'label:first', selected: true },
        { name: 'second filter', query: 'label:second', selected: false },
      ]
      const store = Redux.createStore(FiltersReducer, initialFilters)

      store.dispatch({
        type: 'FILTERS_SELECT',
        filter: {
          name: 'second filter',
        },
      })

      const expectedFilters = [
        { name: 'first filter', query: 'label:first', selected: false },
        { name: 'second filter', query: 'label:second', selected: true },
      ]
      assert.deepEqual(expectedFilters, store.getState())
    })
  })
})
