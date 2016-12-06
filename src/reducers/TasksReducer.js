const _ = require('lodash')

function updateTasks(existingTasks, { tasks, filter }) {
  const tasksByKey = {}

  // Add the existing existingTasks
  existingTasks.forEach(task => (tasksByKey[task.storageKey] = task))

  // Update existingTasks with new values and add new existingTasks
  tasks.forEach(updatedTask => {
    const oldTask = tasksByKey[updatedTask.storageKey]
    let changelog = {}
    let filterQueries = [filter.query]
    let updatedAt = updatedTask.updatedAt

    if (oldTask) {
      updatedAt = oldTask.updatedAt
      filterQueries = _.union(oldTask.filterQueries, filterQueries)
      changelog = Object.assign({}, oldTask.changelog)
      if (oldTask.comments !== updatedTask.comments) {
        changelog.comments = oldTask.comments
        updatedAt = updatedTask.updatedAt
      }
      if (oldTask.state !== updatedTask.state) {
        changelog.state = oldTask.state
        updatedAt = updatedTask.updatedAt
      }
    }

    const customUpdates = { filterQueries, changelog, updatedAt }
    tasksByKey[updatedTask.storageKey] = Object.assign({}, oldTask, updatedTask, customUpdates)
  })


  return Object.keys(tasksByKey).map(key => tasksByKey[key])
}

function clearChangelog(existingTasks, { task }) {
  return existingTasks.map(existingTask => {
    if (task.storageKey === existingTask.storageKey) {
      return Object.assign({}, existingTask, { changelog: {} })
    }
    return existingTask
  })
}

function updateTask(existingTasks, taskToUpdate, newValues) {
  const updatedTasks = existingTasks.map(task => {
    if (task.storageKey === taskToUpdate.storageKey) {
      return Object.assign({}, task, newValues)
    }
    return task
  })
  return updatedTasks
}

function snoozeTask(existingTasks, { task: taskToUpdate }) {
  const newValues = {
    snoozedAt: new Date().toISOString(),
    archivedAt: null,
    ignore: false,
  }
  return updateTask(existingTasks, taskToUpdate, newValues)
}

function ignoreTask(existingTasks, { task: taskToUpdate }) {
  const newValues = {
    snoozedAt: null,
    archivedAt: null,
    ignore: true,
  }
  return updateTask(existingTasks, taskToUpdate, newValues)
}

function archiveTask(existingTasks, { task: taskToUpdate }) {
  const newValues = {
    snoozedAt: null,
    archivedAt: new Date().toISOString(),
    ignore: false,
    changelog: {},
  }
  return updateTask(existingTasks, taskToUpdate, newValues)
}

function restoreTask(existingTasks, { task: taskToUpdate }) {
  const newValues = {
    snoozedAt: null,
    archivedAt: null,
    ignore: false,
  }
  return updateTask(existingTasks, taskToUpdate, newValues)
}

module.exports = (existingTasks = [], action) => {
  switch (action.type) {
    case 'TASKS_EMPTY':
      return []
    case 'TASKS_UPDATE':
      return updateTasks(existingTasks, action)
    case 'TASKS_SNOOZE':
      return snoozeTask(existingTasks, action)
    case 'TASKS_ARCHIVE':
      return archiveTask(existingTasks, action)
    case 'TASKS_IGNORE':
      return ignoreTask(existingTasks, action)
    case 'TASKS_RESTORE':
      return restoreTask(existingTasks, action)
    case 'TASKS_CLEAR_CHANGELOG':
      return clearChangelog(existingTasks, action)
    default:
      return existingTasks
  }
}
