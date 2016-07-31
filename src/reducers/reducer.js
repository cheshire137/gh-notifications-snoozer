import { combineReducers } from 'redux'

function tasks(tasks = [], action) {
  switch (action.type) {
    case 'TASKS_UPDATE':
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
    case 'TASKS_SELECT':
      return tasks.map(task => {
        if (task.id === action.task.id) {
          return Object.assign({}, task, { isSelected: true })
        }
        return task
      })
    case 'TASKS_DESELECT':
      return tasks.map(task => {
        if (task.id === action.task.id) {
          return Object.assign({}, task, { isSelected: false })
        }
        return task
      })
    case 'TASKS_SNOOZE':
      return tasks.map(task => {
        if (task.isSelected) {
          return Object.assign({}, task, { snooze: true })
        }
        return task
      })
    default:
      return tasks
  }
}

module.exports = combineReducers({
  tasks,
})
