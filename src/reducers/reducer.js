import { combineReducers } from 'redux'

function updateTasks(tasks, action) {
  const tasksById = {}

  // Add the existing tasks
  tasks.forEach(task => (tasksById[task.id] = task))

  // Update tasks with new values and add new tasks
  action.tasks.forEach(task => {
    tasksById[task.id] = Object.assign({}, tasksById[task.id], task)
  })

  const updatedTasks = Object.keys(tasksById)
    .map(taskId => tasksById[taskId])
    .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt DESC

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
  return tasks.map(task => {
    if (task.isSelected) {
      return Object.assign({}, task, { snooze: true })
    }
    return task
  })
}

function archiveTasks(tasks) {
  return tasks.map(task => {
    if (task.isSelected) {
      return Object.assign({}, task, { archive: true })
    }
    return task
  })
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
