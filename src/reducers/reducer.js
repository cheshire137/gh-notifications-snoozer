import { combineReducers } from 'redux'
import TasksReducer from './TasksReducer'

module.exports = combineReducers({
  tasks: TasksReducer,
})
