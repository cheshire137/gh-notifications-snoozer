const App = require('./app')
const React = require('react')
const ReactDOM = require('react-dom')

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('content')
)
