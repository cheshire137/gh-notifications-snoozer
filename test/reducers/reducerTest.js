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
        {
          id: 5,
          storageKey: 'issue-5',
          isSelected: false,
          ignore: true,
          archivedAt: null,
          snoozedAt: null,
        },
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
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[1].isSelected, 'task should not be selected')
      assert.equal('string', typeof actual[1].snoozedAt,
                   'snoozedAt should be a time string')
      assert(storage.has('pull-12'),
             'should have a new storage key for the snoozed task')
      assert.equal(storage.get('pull-12'), actual[1].snoozedAt,
                   'snoozedAt should be the same as what we stored')
      assert(storage.get('snoozed').indexOf('pull-12') > -1,
             'task key should be in the snoozed list')
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
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[1].isSelected, 'task should not be selected')
      assert.equal('string', typeof actual[1].archivedAt,
                   'archivedAt should be a time string')
      assert(storage.has('pull-22'),
             'should have a new storage key for the archived task')
      assert.equal(storage.get('pull-22'), actual[1].archivedAt,
                   'archivedAt should be the same as what we stored')
      assert(storage.get('archived').indexOf('pull-22') > -1,
             'task key should be in the archived list')
    })
  })

  describe('TASKS_RESTORE', () => {
    it('restores ignored, selected task', () => {
      storage.clear()
      storage.set('ignored', ['issue-18', 'pull-42'])

      const initialTasks = [
        { id: 18, storageKey: 'issue-18', ignore: true, isSelected: true },
        { id: 42, storageKey: 'pull-42', ignore: true },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert(!actual[0].ignore, 'selected task should not be ignored')
      assert(actual[1].ignore, 'deselected task should be ignored')

      const ignoredTaskKeys = storage.get('ignored')
      assert(ignoredTaskKeys.indexOf('issue-18') < 0,
             'task key should not be in the ignored list')
      assert(ignoredTaskKeys.indexOf('pull-42') > -1,
             'deselected task key should be in the ignored list')
    })

    it('restores archived, selected task', () => {
      storage.clear()
      storage.set('archived', ['issue-99', 'pull-88'])

      const dateStr = new Date().toISOString()
      storage.set('issue-99', dateStr)
      storage.set('pull-88', dateStr)

      const initialTasks = [
        {
          id: 99,
          storageKey: 'issue-99',
          archivedAt: dateStr,
          isSelected: true,
        },
        { id: 88, storageKey: 'pull-88', archivedAt: dateStr },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert.equal(null, actual[0].archivedAt,
                   'selected task should not have archivedAt')
      assert.equal(dateStr, actual[1].archivedAt,
                   'deselected task should have archivedAt')

      const archivedTaskKeys = storage.get('archived')
      assert(archivedTaskKeys.indexOf('issue-99') < 0,
             'task key should not be in the archived list')
      assert(archivedTaskKeys.indexOf('pull-88') > -1,
             'deselected task key should be in the archived list')

      assert(storage.has('pull-88'),
             'deselected task should still be in storage')
      assert(!storage.has('issue-99'),
             'selected task should not still be in storage')
    })

    it('restores snoozed, selected task', () => {
      storage.clear()
      storage.set('snoozed', ['issue-97', 'pull-183'])

      const dateStr = new Date().toISOString()
      storage.set('issue-97', dateStr)
      storage.set('pull-183', dateStr)

      const initialTasks = [
        {
          id: 97,
          storageKey: 'issue-97',
          snoozedAt: dateStr,
          isSelected: true,
        },
        { id: 183, storageKey: 'pull-183', snoozedAt: dateStr },
      ]

      const store = Redux.createStore(reducer, { tasks: initialTasks })
      store.dispatch({ type: 'TASKS_RESTORE' })

      const actual = store.getState().tasks
      assert.equal(2, actual.length, 'should still have 2 tasks')
      assert.equal(null, actual[0].snoozedAt,
                   'selected task should not have snoozedAt')
      assert.equal(dateStr, actual[1].snoozedAt,
                   'deselected task should have snoozedAt')

      const snoozedTaskKeys = storage.get('snoozed')
      assert(snoozedTaskKeys.indexOf('issue-97') < 0,
             'task key should not be in the snoozed list')
      assert(snoozedTaskKeys.indexOf('pull-183') > -1,
             'deselected task key should be in the snoozed list')

      assert(storage.has('pull-183'),
             'deselected task should still be in storage')
      assert(!storage.has('issue-97'),
             'selected task should not still be in storage')
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
