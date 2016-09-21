const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')
const TabbedNav = require('../../src/components/TabbedNav')

describe('TabbedNav', () => {
  let renderedDOM

  before(() => {
    const component = TestUtils.renderIntoDocument(<TabbedNav />)
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  it('has three links', () => {
    const notificationsLink = renderedDOM().querySelectorAll('notifications-link')
    const filtersLink = renderedDOM().querySelectorAll('filters-link')
    const authLink = renderedDOM().querySelectorAll('auth-link')

    assert(notificationsLink)
    assert(filtersLink)
    assert(authLink)
  })
})
