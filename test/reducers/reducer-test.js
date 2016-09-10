const assert = require('assert')
const Redux = require('redux')

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })

const reducer = require('../../src/reducers/reducer')

describe('reducers', () => {
  it('has the correct default initial state', () => {
    const store = Redux.createStore(reducer)
    assert.deepEqual({ tasks: [] }, store.getState())
  })

  describe('TASKS_SELECT', () => {
    it('selects specified task', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SELECT', task: { storageKey: 'pull-2' } })

      const expectedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        {
          id: 2,
          storageKey: 'pull-2',
          title: 'more task',
          updatedAt: now,
          isSelected: true,
        },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })

  describe('TASKS_DESELECT', () => {
    it('deselects the specified task', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: now,
          isSelected: true,
        },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({
        type: 'TASKS_DESELECT',
        task: { storageKey: 'issue-1' },
      })

      const expectedTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: now,
          isSelected: false,
        },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })

  describe('TASKS_IGNORE', () => {
    it('ignores selected task', () => {
      const initialTasks = [
        { id: 5, storageKey: 'issue-5', isSelected: true },
        { id: 2, storageKey: 'pull-2' },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_IGNORE' })

      const expectedTasks = [
        { id: 5, storageKey: 'issue-5', isSelected: true, ignore: true },
        { id: 2, storageKey: 'pull-2' },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })

  describe('TASKS_SNOOZE', () => {
    it('snoozes selected task', () => {
      storage.clear()

      const initialTasks = [
        { id: 15, storageKey: 'issue-15' },
        { id: 12, storageKey: 'pull-12', isSelected: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_SNOOZE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length)
      assert(actual[1].isSelected)
      assert.equal('string', typeof actual[1].snoozedAt)
      assert(storage.has('pull-12'))
      assert.equal(storage.get('pull-12'), actual[1].snoozedAt)
      assert(storage.get('snoozed').indexOf('pull-12') > -1)
    })
  })

  describe('TASKS_ARCHIVE', () => {
    it('archives the selected task', () => {
      storage.clear()

      const initialTasks = [
        { id: 35, storageKey: 'issue-35' },
        { id: 22, storageKey: 'pull-22', isSelected: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_ARCHIVE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length)
      assert(actual[1].isSelected)
      assert.equal('string', typeof actual[1].archivedAt)
      assert(storage.has('pull-22'))
      assert.equal(storage.get('pull-22'), actual[1].archivedAt)
      assert(storage.get('archived').indexOf('pull-22') > -1)
    })
  })

  describe('TASKS_EMPTY', () => {
    it('empties the tasks list', () => {
      const initialTasks = [
        {
          id: 1,
          storageKey: 'issue-1',
          title: 'task',
          updatedAt: '2016-06-15T20:14:46Z',
        },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_EMPTY' })

      assert.deepEqual([], store.getState().tasks)
    })
  })

  describe('TASKS_UPDATE', () => {
    it('updates existing tasks', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'more task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, storageKey: 'issue-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'updated title', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })

    it('adds new tasks', () => {
      const now = new Date().toISOString()
      const initialTasks = [
        { id: 1, storageKey: 'pull-1', title: 'task', updatedAt: now },
      ]

      const updatedTasks = [
        { id: 2, storageKey: 'pull-2', title: 'new task', updatedAt: now },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_UPDATE', tasks: updatedTasks })

      const expectedTasks = [
        { id: 1, storageKey: 'pull-1', title: 'task', updatedAt: now },
        { id: 2, storageKey: 'pull-2', title: 'new task', updatedAt: now },
      ]

      assert.deepEqual(expectedTasks, store.getState().tasks)
    })
  })
})
