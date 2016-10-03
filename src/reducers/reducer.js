import { combineReducers } from 'redux'
import ElectronConfig from 'electron-config'
import GitHub from '../models/GitHub'

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

function updateTasks(tasks, action) {
  const tasksByKey = {}
  const notificationUrls = notificationsBySubject(action.notifications)

  // Add the existing tasks
  tasks.forEach(task => (tasksByKey[task.storageKey] = task))

  // Update tasks with new values and add new tasks
  action.tasks.forEach((newTask) => {
    const oldTask = tasksByKey[newTask.storageKey] || {}
    const filters = oldTask.filters ? [action.filter, ...oldTask.filters] : [action.filter]
    const updatedTask = Object.assign({}, oldTask, newTask, { filters })
    const notificationUrl = notificationUrls[newTask.apiUrl]
    if (notificationUrl) {
      updatedTask.notificationUrl = notificationUrl
    }
    tasksByKey[newTask.storageKey] = updatedTask
  })

  return Object.keys(tasksByKey).map(key => tasksByKey[key])
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
  return updatedTasks
}

function ignoreTasks(tasks) {
  const ignoredTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      ignoredTasks.push(task)
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
  return updatedTasks
}

function archiveTasks(tasks) {
  const archivedTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
      const archivedAt = currentTimeString()
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
  return updatedTasks
}

function restoreTasks(tasks) {
  const restoredTasks = []
  const updatedTasks = tasks.map(task => {
    if (task.isSelected) {
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
    default:
      return tasks
  }
}

module.exports = combineReducers({
  tasks: tasksReducer,
})
