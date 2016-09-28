const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')
const TabbedNav = require('../../src/components/TabbedNav')

describe('TabbedNav', () => {
  let renderedDOM

  context('when no user is given', () => {
    before(() => {
      const component = TestUtils.renderIntoDocument(<TabbedNav />)
      renderedDOM = () => ReactDOM.findDOMNode(component)
    })

    it('has notifications link', () => {
      const notificationsLink = renderedDOM().
          querySelector('#notifications-link')
      assert(notificationsLink, 'Should have a notifications link')
    })

    it('has filters link', () => {
      const filtersLink = renderedDOM().querySelector('#filters-link')
      assert(filtersLink, 'Should have a filters link')
    })

    it('has auth link', () => {
      const authLink = renderedDOM().querySelector('#auth-link')
      assert(authLink, 'Should have an auth link')
      assert.equal('Authenticate', authLink.textContent)
    })

    it('does not display user login', () => {
      const userLogins = renderedDOM().querySelectorAll('.user-login')
      assert.equal(0, userLogins.length)
    })
  })

  context('when a user is given', () => {
    const user = { login: 'FuzzyCatPhotos187' }

    before(() => {
      const component = TestUtils.renderIntoDocument(
        <TabbedNav user={user} />
      )
      renderedDOM = () => ReactDOM.findDOMNode(component)
    })

    it('has notifications link', () => {
      const notificationsLink = renderedDOM().
          querySelector('#notifications-link')
      assert(notificationsLink, 'Should have a notifications link')
    })

    it('has filters link', () => {
      const filtersLink = renderedDOM().querySelector('#filters-link')
      assert(filtersLink, 'Should have a filters link')
    })

    it('has auth link', () => {
      const authLink = renderedDOM().querySelector('#auth-link')
      assert(authLink, 'Should have an auth link')
    })

    it('displays user login', () => {
      const userLogin = renderedDOM().querySelector('.user-login')
      assert.equal(user.login, userLogin.textContent)
    })
  })
})
