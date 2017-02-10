/* eslint no-underscore-dangle: "off" */

import mkdirp from 'mkdirp'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import App from './components/App'
import reducer from './reducers/reducer'
import { remote } from 'electron'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'

// This hack makes my blood boil. But without it the initial state is
// used instead of using the persisted state from AsyncNodeStorage. I'd prefer
// to use something other than setTimeout to make this work, but it works for
// now.
const hackToLoadEverything = store => {
  const render = () => {
    ReactDom.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('content')
    )
  }

  setTimeout(render, 10)
}

window.onload = function() {
  const pathName = process.env.NODE_ENV === 'development' ? 'desktop' : 'userData'
  const persistDir = remote.app.getPath(pathName)
  mkdirp.sync(persistDir)

  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  const enhancers = compose(autoRehydrate(), reduxDevTools)
  const store = createStore(reducer, undefined, enhancers)
  const persistOptions = { storage: new AsyncNodeStorage(persistDir) }
  persistStore(store, persistOptions)

  hackToLoadEverything(store)
}
