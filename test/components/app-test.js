const assert = require('assert')

const App = require('../../src/components/App')
const jsdom = require('jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')
const Config = require('../../src/config.json')

describe('App', () => {
  before(() => {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
    global.window = global.document.defaultView
    fetchMock.get(`${Config.githubApiUrl}/notifications`, [])
  })

  after(() => {
    fetchMock.restore()
  })

  it('renders', () => {
    const appComponent = TestUtils.renderIntoDocument(<App />)
    assert(ReactDOM.findDOMNode(appComponent))
  })
})
