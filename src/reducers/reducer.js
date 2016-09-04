import { combineReducers } from 'redux'
import ElectronConfig from 'electron-config'

const storage = new ElectronConfig()
const SNOOZED_KEY = 'snoozed'
const ARCHIVED_KEY = 'archived'

// Fetch from the JSON storage file the task IDs saved under the given key.
function getSavedTaskKeys(key) {
  return storage.has(key) ? storage.get(key) : []
}

// Persist the given tasks under the given key in the JSON storage file.
function writeChanges(tasks, typeKey) {
  const existingTaskKeys = getSavedTaskKeys(typeKey)
  const newTaskKeys = tasks.map(task => task.storageKey)
  const allTaskKeys = []
  existingTaskKeys.concat(newTaskKeys).forEach(key => {
    if (allTaskKeys.indexOf(key) < 0) {
      allTaskKeys.push(key)
    }
  })
  storage.set(typeKey, allTaskKeys)
}

function updateTasks(tasks, action) {
  const tasksByKey = {}
  const snoozedTasks = getSavedTaskKeys(SNOOZED_KEY)
  const archivedTasks = getSavedTaskKeys(ARCHIVED_KEY)

  // Add the existing tasks
  tasks.forEach(task => (tasksByKey[task.storageKey] = task))

  // Update tasks with new values and add new tasks
  action.tasks.forEach(task => {
    tasksByKey[task.storageKey] = Object.assign({},
                                                tasksByKey[task.storageKey],
                                                task)
  })

  const updatedTasks = Object.keys(tasksByKey).map(key => {
    const task = tasksByKey[key]
    if (snoozedTasks.indexOf(key) > -1) {
      task.snoozedAt = storage.get(key)
    }
    if (archivedTasks.indexOf(key) > -1) {
      task.archivedAt = storage.get(key)
    }
    return task
  })

  return updatedTasks
}

function selectTasks(tasks, action) {
  return tasks.map(task => {
    if (task.storageKey === action.task.storageKey) {
      return Object.assign({}, task, { isSelected: true })
    }
    return task
  })
}

function deselectTasks(tasks, action) {
  return tasks.map(task => {
    if (task.storageKey === action.task.storageKey) {
      return Object.assign({}, task, { isSelected: false })
    }
    return task
  })
}

function currentTimeString() {
  const date = new Date()
  return date.toISOString()
}

function snoozeTasks(tasks) {
  const snoozedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      const snoozedAt = currentTimeString()
      storage.set(task.storageKey, snoozedAt)
      snoozedTasks.push(task)
      return Object.assign({}, task, { snoozedAt, archivedAt: null })
    }
    return task
  })
  writeChanges(snoozedTasks, SNOOZED_KEY)
  return updatedTasks
}

function archiveTasks(tasks) {
  const archivedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      const archivedAt = currentTimeString()
      storage.set(task.storageKey, archivedAt)
      archivedTasks.push(task)
      return Object.assign({}, task, { archivedAt, snoozedAt: null })
    }
    return task
  })
  writeChanges(archivedTasks, ARCHIVED_KEY)
  return updatedTasks
}

function tasksReducer(tasks = [], action) {
  switch (action.type) {
    case 'TASKS_EMPTY':
      return []
    case 'TASKS_UPDATE':
      return updateTasks(tasks, action)
    case 'TASKS_SELECT':
      return selectTasks(tasks, action)
    case 'TASKS_DESELECT':
      return deselectTasks(tasks, action)
    case 'TASKS_SNOOZE':
      return snoozeTasks(tasks)
    case 'TASKS_ARCHIVE':
      return archiveTasks(tasks)
    default:
      return tasks
  }
}

module.exports = combineReducers({
  tasks: tasksReducer,
})
