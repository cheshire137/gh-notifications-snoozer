import { combineReducers } from 'redux'

import FiltersReducer from './FiltersReducer'
import TasksReducer from './TasksReducer'

module.exports = combineReducers({
  tasks: TasksReducer,
  filters: FiltersReducer,
})
