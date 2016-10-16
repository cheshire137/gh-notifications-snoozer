const React = require('react')
const ReactDom = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const { remote } = require('electron')
const { persistStore, autoRehydrate } = require('redux-persist')
const { AsyncNodeStorage } = require('redux-persist-node-storage')

const App = require('./components/App')
const reducer = require('./reducers/reducer')
const store = Redux.createStore(reducer, undefined, autoRehydrate())

const persistDir = remote.app.getPath('userData')
const persistOptions = { storage: new AsyncNodeStorage(persistDir) }
persistStore(store, persistOptions)

ReactDom.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  document.getElementById('content')
)
