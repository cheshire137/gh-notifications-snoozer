module.exports = function(tasks = [], action) {
  switch (action.type) {
    case 'TASK_ADD':
      return [...tasks, action.task]
    default:
      return tasks
  }
}
