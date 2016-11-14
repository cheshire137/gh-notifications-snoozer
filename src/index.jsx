import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import App from './components/App'
import reducer from './reducers/reducer'
import { remote } from 'electron'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'

window.onload = function() {
  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  const enhancers = compose(autoRehydrate(), reduxDevTools)
  const store = createStore(reducer, undefined, enhancers)
  const persistDir = remote.app.getPath('desktop')
  const persistOptions = { storage: new AsyncNodeStorage(persistDir) }
  persistStore(store, persistOptions)

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('content')
  )
}
