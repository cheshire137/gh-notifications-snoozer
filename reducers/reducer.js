module.exports = function(tasks = [], action) {
  switch (action.type) {
    case 'TASK_ADD':
      return [...tasks, action.task]
    case 'TASK_UPDATE':
      return [action.tasks]
    default:
      return tasks
  }
}
