const _ = require('lodash')

function updateTasks(existingTasks, { tasks, filter }) {
  const tasksByKey = {}

  // Add the existing existingTasks
  existingTasks.forEach(task => (tasksByKey[task.storageKey] = task))

  // Update existingTasks with new values and add new existingTasks
  tasks.forEach((updatedTask) => {
    const oldTask = tasksByKey[updatedTask.storageKey]
    let previousValues = {}
    let filterQueries = [filter.query]
    let updatedAt = updatedTask.updatedAt

    if (oldTask) {
      filterQueries = _.union(oldTask.filterQueries, filterQueries)
      previousValues = Object.assign({}, oldTask.previousValues)
      if (oldTask.comments !== updatedTask.comments) {
        previousValues.comments = oldTask.comments
        updatedAt = updatedTask.updatedAt
      }
      if (oldTask.state !== updatedTask.state) {
        previousValues.state = oldTask.state
        updatedAt = updatedTask.updatedAt
      }
    }

    const customUpdates = { filterQueries, previousValues, updatedAt }
    tasksByKey[updatedTask.storageKey] = Object.assign({}, oldTask, updatedTask, customUpdates)
  })


  return Object.keys(tasksByKey).map(key => tasksByKey[key])
}

function selectTasks(existingTasks, { task }) {
  const selectedTasks = []
  const updatedTasks = existingTasks.map(t => {
    if (t.storageKey === task.storageKey) {
      selectedTasks.push(t)
      return Object.assign({}, t, { isSelected: true })
    }
    return t
  })
  console.info('select', selectedTasks.map(t => t.storageKey))
  return updatedTasks
}

function deselectTasks(existingTasks, { task }) {
  const deselectedTasks = []
  const updatedTasks = existingTasks.map(t => {
    if (t.storageKey === task.storageKey) {
      deselectedTasks.push(t)
      return Object.assign({}, t, { isSelected: false })
    }
    return t
  })
  console.info('deselect', deselectedTasks.map(t => t.storageKey))
  return updatedTasks
}

function currentTimeString() {
  const date = new Date()
  return date.toISOString()
}

function snoozeTasks(existingTasks) {
  const snoozedTasks = []
  const updatedTasks = existingTasks.map(task => {
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
  return updatedTasks
}

function ignoreTasks(existingTasks) {
  const ignoredTasks = []
  const updatedTasks = existingTasks.map(task => {
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
  return updatedTasks
}

function archiveTasks(existingTasks) {
  const updatedTasks = existingTasks.map(task => {
    if (task.isSelected) {
      const archivedAt = currentTimeString()
      return Object.assign({}, task, {
        archivedAt,
        snoozedAt: null,
        isSelected: false,
        ignore: false,
        previousValues: {},
      })
    }
    return task
  })
  return updatedTasks
}

function restoreTasks(existingTasks) {
  const restoredTasks = []
  const updatedTasks = existingTasks.map(task => {
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
  return updatedTasks
}

module.exports = (existingTasks = [], action) => {
  switch (action.type) {
    case 'TASKS_EMPTY':
      return []
    case 'TASKS_UPDATE':
      return updateTasks(existingTasks, action)
    case 'TASKS_SELECT':
      return selectTasks(existingTasks, action)
    case 'TASKS_DESELECT':
      return deselectTasks(existingTasks, action)
    case 'TASKS_SNOOZE':
      return snoozeTasks(existingTasks)
    case 'TASKS_ARCHIVE':
      return archiveTasks(existingTasks)
    case 'TASKS_IGNORE':
      return ignoreTasks(existingTasks)
    case 'TASKS_RESTORE':
      return restoreTasks(existingTasks)
    default:
      return existingTasks
  }
}
