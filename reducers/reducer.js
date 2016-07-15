// This is temporary fake data
const DEFAULT_TASKS = [
  {id: 1, title: "this is a task" },
  {id: 2, title: "this is also a task" }
]

module.exports = function(tasks = DEFAULT_TASKS, action) {
  switch (action.type) {
    case 'TASK_ADD':
      return [...tasks, action.task]
    default:
      return tasks
  }
}
