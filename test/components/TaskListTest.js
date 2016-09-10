const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const ReactRedux = require('react-redux')
const Redux = require('redux')
const TestUtils = require('react-addons-test-utils')
const fetchMock = require('fetch-mock')

const ElectronConfig = require('electron-config')
const storage = new ElectronConfig({ name: 'config-test' })

const Config = require('../../src/config.json')
const App = require('../../src/components/App')
const reducer = require('../../src/reducers/reducer')
const GitHubAuth = require('../../src/models/GitHubAuth')
const Filter = require('../../src/models/Filter')
const LastFilter = require('../../src/models/LastFilter')
const fixtures = require('../fixtures')

describe('TaskList', () => {
  let renderedDOM
  let store

  before(() => {
    storage.clear()

    // Persist access token
    GitHubAuth.setToken('test-whee')

    // Fake responses from GitHub API
    fetchMock.get(`${Config.githubApiUrl}/user`, { login: 'testuser123' })
    fetchMock.get(`${Config.githubApiUrl}/search/issues?q=cats`,
                  { items: [fixtures.pullRequest] })

    // Persist a filter
    const filter = new Filter('Cool name')
    filter.store('cats')
    LastFilter.save('Cool name')

    store = Redux.createStore(reducer, { tasks: [] })
    const component = TestUtils.renderIntoDocument(
      <ReactRedux.Provider store={store}>
        <App />
      </ReactRedux.Provider>
    )
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  it('shows task that is not snoozed, archived, or ignored', () => {
    const taskListItems = renderedDOM().querySelectorAll('.task-list-item')
    assert.equal(1, taskListItems.length)
  })

  it('does not show task that is ignored', () => {
  })

  it('does not show task that is archived', () => {
    store.dispatch({ type: 'TASKS_SELECT', task: {
      storageKey: 'pull-163031382',
    } })
    store.dispatch({ type: 'TASKS_ARCHIVE' })

    const taskListItems = renderedDOM().querySelectorAll('.task-list-item')
    assert.equal(0, taskListItems.length)
  })

  it('does not show task that is snoozed', () => {
    store.dispatch({ type: 'TASKS_SELECT', task: {
      storageKey: 'pull-163031382',
    } })
    store.dispatch({ type: 'TASKS_SNOOZE' })

    const taskListItems = renderedDOM().querySelectorAll('.task-list-item')
    assert.equal(0, taskListItems.length)
  })

  context('when the snooze button is clicked', () => {
    before(() => {
      store.dispatch({ type: 'TASKS_SELECT', task: {
        storageKey: 'pull-163031382',
      } })

      TestUtils.Simulate.click(renderedDOM().querySelector('#snooze-button'))
    })

    it('hides selected tasks', () => {
      const taskListItems = renderedDOM().querySelectorAll('.task-list-item')
      assert.equal(0, taskListItems.length)
    })

    it("updates the selected task's `snoozedAt` field", () => {
      const task = store.getState().tasks[0]
      assert.equal('string', typeof task.snoozedAt)
    })

    it('shows the tasks again, starting at midnight of the next day')
  })

  context('when the archive button is clicked', () => {
    before(() => {
      store.dispatch({ type: 'TASKS_SELECT', task: {
        storageKey: 'pull-163031382',
      } })

      TestUtils.Simulate.click(renderedDOM().querySelector('#archive-button'))
    })

    it('hides selected tasks', () => {
      const taskListItems = renderedDOM().querySelectorAll('.task-list-item')
      assert.equal(0, taskListItems.length)
    })

    it("updates the selected task's `archivedAt` field", () => {
      const task = store.getState().tasks[0]
      assert.equal('string', typeof task.archivedAt)
    })

    it('shows tasks again if `updated_at` is greater than `archived_at`')
  })

  context('when the ignore button is clicked', () => {
    it('hides selected tasks')
    it("updates the selected task's `ignored` field")
  })
})
