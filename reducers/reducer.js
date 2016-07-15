module.exports = function(tasks = [], action) {
  switch (action.type) {
    case 'ADD':
      return [...tasks, action.task]
    default:
      return tasks
  }
}
