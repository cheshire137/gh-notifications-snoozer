import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './components/App'
import reducer from './reducers/reducer'
import { remote } from 'electron'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'

window.onload = function() {
  const store = createStore(reducer, undefined, autoRehydrate())
  const persistDir = remote.app.getPath('userData')
  const persistOptions = { storage: new AsyncNodeStorage(persistDir) }
  persistStore(store, persistOptions)

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('content')
  )
}
