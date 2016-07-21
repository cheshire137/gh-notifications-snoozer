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
      console.log("ok");
      return [action.tasks]
    default:
      return tasks
  }
}
