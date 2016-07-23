// THIS IS DUMMY DATA THAT WILL BE REPLACED BY ACTUAL API CALLS
const defaultTasks = [
  { id: 1, title: 'this is a task' },
  { id: 2, title: 'this is also a task' },
  { id: 3, title: 'ignore this one', ignore: true },
  { id: 5, title: 'this one is archived', snooze: true },
]
// const defaultTasks = []

module.exports = function(tasks = defaultTasks, action) {
  switch (action.type) {
    case 'TASKS_ADD':
      return [...tasks, action.task]
    case 'TASKS_UPDATE':
      return action.tasks
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
