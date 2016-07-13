const React = require('react')
const ReactDOM = require('react-dom')

class App extends React.Component {
  render() {
    return (
      <p>sarah</p>
    )
    // return React.createElement('p', {}, 'sarah')
  }
}


ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('content')
)
