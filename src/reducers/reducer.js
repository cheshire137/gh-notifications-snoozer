const defaultTasks = [
  {id: 1, title: "this is a task" },
  {id: 2, title: "this is also a task" },
  {id: 3, title: "ignore this one", ignore: true },
  {id: 5, title: "this one is archived", snooze: true }
]
// const defaultTasks = []

module.exports = function(tasks = defaultTasks, action) {
  switch (action.type) {
    case 'TASKS_ADD':
      return [...tasks, action.task]
    case 'TASKS_UPDATE':
      return [action.tasks]
    case 'TASKS_SELECT':
      console.log("in");
      return tasks.map(task => {
        if (task.id == action.task.id) {
          task.selected = true
        }
        return tasks
      })
    case 'TASKS_UNSELECT':
      return tasks.map(task => {
        if (task.id == action.task.id) {
          task.selected = false
        }
        return tasks
      })
    case 'TASKS_SNOOZE':
      return tasks.map(task => {
        if (task.isSelected) {
          task.snooze = true
        }
        return tasks
      })
    default:
      return tasks
  }
}
