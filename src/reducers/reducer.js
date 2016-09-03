import { combineReducers } from 'redux'
import ElectronConfig from 'electron-config'

const storage = new ElectronConfig()
const SNOOZED_KEY = 'snoozed'
const ARCHIVED_KEY = 'archived'

// Gets an identifier for the given task to be used with persisting the task's
// state to the JSON storage file.
function taskKey(task) {
  return `${task.type}-${task.id}`
}

// Fetch from the JSON storage file the task IDs saved under the given key.
function getSavedTaskKeys(key) {
  return storage.has(key) ? storage.get(key) : []
}

// Persist the given tasks under the given key in the JSON storage file.
function writeChanges(tasks, typeKey) {
  const existingTaskKeys = getSavedTaskKeys(typeKey)
  const newTaskKeys = tasks.map(task => taskKey(task))
  const allTaskKeys = []
  existingTaskKeys.concat(newTaskKeys).forEach(key => {
    if (allTaskKeys.indexOf(key) < 0) {
      allTaskKeys.push(key)
    }
  })
  storage.set(typeKey, allTaskKeys)
}

function updateTasks(tasks, action) {
  const tasksById = {}
  const snoozedTasks = getSavedTaskKeys(SNOOZED_KEY)
  const archivedTasks = getSavedTaskKeys(ARCHIVED_KEY)

  // Add the existing tasks
  tasks.forEach(task => (tasksById[task.id] = task))

  // Update tasks with new values and add new tasks
  action.tasks.forEach(task => {
    tasksById[task.id] = Object.assign({}, tasksById[task.id], task)
  })

  const updatedTasks = Object.keys(tasksById).map(taskId => {
    const task = tasksById[taskId]
    const key = taskKey(task)
    if (snoozedTasks.indexOf(key) > -1) {
      task.snooze = true
    }
    if (archivedTasks.indexOf(key) > -1) {
      task.archivedAt = storage.get(key)
    }
    return task
  }).sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt DESC

  return updatedTasks
}

function selectTasks(tasks, action) {
  return tasks.map(task => {
    if (task.id === action.task.id) {
      return Object.assign({}, task, { isSelected: true })
    }
    return task
  })
}

function deselectTasks(tasks, action) {
  return tasks.map(task => {
    if (task.id === action.task.id) {
      return Object.assign({}, task, { isSelected: false })
    }
    return task
  })
}

function snoozeTasks(tasks) {
  const snoozedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      snoozedTasks.push(task)
      return Object.assign({}, task, { snooze: true })
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
      const date = new Date()
      const archivedAt = date.toISOString()
      storage.set(taskKey(task), archivedAt)
      archivedTasks.push(task)
      return Object.assign({}, task, { archivedAt })
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
