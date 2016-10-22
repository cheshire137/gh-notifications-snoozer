import { combineReducers } from 'redux'
import ElectronConfig from 'electron-config'
import GitHub from '../models/GitHub'

const configName = process.env.NODE_ENV === 'test' ? 'config-test' : 'config'
const storage = new ElectronConfig({ name: configName })
const SNOOZED_KEY = 'snoozed'
const ARCHIVED_KEY = 'archived'
const IGNORED_KEY = 'ignored'

// Fetch from the JSON storage file the task IDs saved under the given key.
function getSavedTaskKeys(key) {
  return storage.has(key) ? storage.get(key) : []
}

// Persist the given tasks under the given key in the JSON storage file.
function writeChanges(tasks, typeKey) {
  const existingTaskKeys = getSavedTaskKeys(typeKey)
  const newTaskKeys = tasks.map(task => task.storageKey)
  console.info(typeKey, newTaskKeys)
  const allTaskKeys = []
  existingTaskKeys.concat(newTaskKeys).forEach(key => {
    if (allTaskKeys.indexOf(key) < 0) {
      allTaskKeys.push(key)
    }
  })
  storage.set(typeKey, allTaskKeys)
}

function notificationsBySubject(notifications) {
  const result = {}
  if (typeof notifications === 'undefined') {
    return result
  }
  notifications.forEach(notification => {
    result[notification.subject.url] = notification.url
  })
  return result
}

// Remove the given tasks from the given key in the JSON storage file.
function removeTasks(tasks, typeKey) {
  const existingTaskKeys = getSavedTaskKeys(typeKey)
  const keysToRemove = tasks.map(task => task.storageKey)
  const allTaskKeys = []
  existingTaskKeys.forEach(key => {
    if (keysToRemove.indexOf(key) < 0) {
      allTaskKeys.push(key)
    }
  })
  storage.set(typeKey, allTaskKeys)
}

function updateTasks(tasks, action) {
  const tasksByKey = {}
  const snoozedTasks = getSavedTaskKeys(SNOOZED_KEY)
  const archivedTasks = getSavedTaskKeys(ARCHIVED_KEY)
  const ignoredTasks = getSavedTaskKeys(IGNORED_KEY)
  const notificationUrls = notificationsBySubject(action.notifications)

  // Add the existing tasks
  tasks.forEach(task => (tasksByKey[task.storageKey] = task))

  // Update tasks with new values and add new tasks
  action.tasks.forEach(task => {
    const updatedTask = Object.assign({}, tasksByKey[task.storageKey], task)
    const notificationUrl = notificationUrls[task.apiUrl]
    if (notificationUrl) {
      updatedTask.notificationUrl = notificationUrl
    }
    tasksByKey[task.storageKey] = updatedTask
  })

  const updatedTasks = Object.keys(tasksByKey).map(key => {
    const task = tasksByKey[key]
    if (snoozedTasks.indexOf(key) > -1) {
      task.snoozedAt = storage.get(key)
    }
    if (archivedTasks.indexOf(key) > -1) {
      task.archivedAt = storage.get(key)
    }
    if (ignoredTasks.indexOf(key) > -1) {
      task.ignore = true
    }
    return task
  })

  return updatedTasks
}

function focusTasks(tasks, action) {
  const focusedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.storageKey === action.task.storageKey) {
      focusedTasks.push(task)
      return Object.assign({}, task, { isFocused: true })
    }
    if (task.isFocused) {
      return Object.assign({}, task, { isFocused: null })
    }
    return task
  })
  console.info('focus', focusedTasks.map(task => task.storageKey))
  return updatedTasks
}

function selectTasks(tasks, action) {
  const selectedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.storageKey === action.task.storageKey) {
      selectedTasks.push(task)
      return Object.assign({}, task, { isSelected: true })
    }
    return task
  })
  console.info('select', selectedTasks.map(task => task.storageKey))
  return updatedTasks
}

function defocusTasks(tasks) {
  const defocusedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isFocused) {
      defocusedTasks.push(task)
      return Object.assign({}, task, { isFocused: null })
    }
    return task
  })
  console.info('defocus', defocusedTasks.map(task => task.storageKey))
  return updatedTasks
}

function deselectTasks(tasks, action) {
  const deselectedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.storageKey === action.task.storageKey) {
      deselectedTasks.push(task)
      return Object.assign({}, task, { isSelected: false })
    }
    return task
  })
  console.info('deselect', deselectedTasks.map(task => task.storageKey))
  return updatedTasks
}

function currentTimeString() {
  const date = new Date()
  return date.toISOString()
}

function markNotificationsAsRead(tasks) {
  const tasksWithNotifications = tasks.filter(task => {
    return typeof task.notificationUrl === 'string'
  })
  const github = new GitHub()
  tasksWithNotifications.forEach(task => {
    github.markAsRead(task.notificationUrl).catch(err => {
      console.error('failed to mark notification as read', err, task)
    })
  })
}

function snoozeTasks(tasks) {
  const snoozedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      const snoozedAt = currentTimeString()
      storage.set(task.storageKey, snoozedAt)
      snoozedTasks.push(task)
      return Object.assign({}, task, {
        snoozedAt,
        archivedAt: null,
        isSelected: false,
        ignore: false,
      })
    }
    return task
  })
  markNotificationsAsRead(snoozedTasks)
  writeChanges(snoozedTasks, SNOOZED_KEY)
  return updatedTasks
}

function ignoreTasks(tasks) {
  const ignoredTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      ignoredTasks.push(task)
      if (storage.has(task.storageKey)) {
        storage.delete(task.storageKey)
      }
      return Object.assign({}, task, {
        ignore: true,
        isSelected: false,
        snoozedAt: null,
        archivedAt: null,
      })
    }
    return task
  })
  markNotificationsAsRead(ignoredTasks)
  writeChanges(ignoredTasks, IGNORED_KEY)
  return updatedTasks
}

function archiveTasks(tasks) {
  const archivedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      const archivedAt = currentTimeString()
      storage.set(task.storageKey, archivedAt)
      archivedTasks.push(task)
      return Object.assign({}, task, {
        archivedAt,
        snoozedAt: null,
        isSelected: false,
        ignore: false,
      })
    }
    return task
  })
  markNotificationsAsRead(archivedTasks)
  writeChanges(archivedTasks, ARCHIVED_KEY)
  return updatedTasks
}

function restoreTasks(tasks) {
  const restoredTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      storage.delete(task.storageKey)
      restoredTasks.push(task)
      return Object.assign({}, task, {
        archivedAt: null,
        ignore: false,
        snoozedAt: null,
        isSelected: false,
      })
    }
    return task
  })
  console.info('restore', restoredTasks.map(task => task.storageKey))
  removeTasks(restoredTasks, ARCHIVED_KEY)
  removeTasks(restoredTasks, SNOOZED_KEY)
  removeTasks(restoredTasks, IGNORED_KEY)
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
    case 'TASKS_IGNORE':
      return ignoreTasks(tasks)
    case 'TASKS_RESTORE':
      return restoreTasks(tasks)
    case 'TASKS_FOCUS':
      return focusTasks(tasks, action)
    case 'TASKS_DEFOCUS':
      return defocusTasks(tasks)
    default:
      return tasks
  }
}

module.exports = combineReducers({
  tasks: tasksReducer,
})
