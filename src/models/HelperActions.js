const GitHub = require('./GitHub')

module.exports = class HelperActions {
  static updateTasks(dispatch, filter) {
    const github = new GitHub()
    return github.getTasks(filter).then(result => {
      const { tasks } = result

      // GitHub's api doesn't like when the output includes milliseconds
      const updatedAt = (new Date()).toISOString().replace(/\.\d{3}Z/, 'Z')
      const updatedFilter = Object.assign({}, filter, { updatedAt })
      dispatch({ type: 'FILTERS_UPDATE', filter: updatedFilter })
      dispatch({ type: 'TASKS_UPDATE', filter, tasks })
    })
  }
}
