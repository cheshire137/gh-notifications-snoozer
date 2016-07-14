const Main = require('./components/Main')
const React = require('react')
const ReactDOM = require('react-dom')

ReactDOM.render(
  React.createElement(Main, null),
  document.getElementById('content')
)
