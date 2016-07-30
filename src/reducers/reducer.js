import { combineReducers } from 'redux'

function tasks(tasks = [], action) {
  switch (action.type) {
    case 'TASKS_UPDATE':
      // There is probably a better way to do this.
      // Any old task that isn't in the new tasks is marked as closed
      // Any new task that isn't in the old tasks is added
      const newIds = action.tasks.map(({ id }) => id)
      const closedTasks = tasks
        .filter(({ id }) => !newIds.includes(id))
        .map((task) => Object.assign({}, task, { state: 'closed' }))
      return [...action.tasks, ...closedTasks].sort((a, b) => a.id - b.id)
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
