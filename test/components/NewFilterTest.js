const assert = require('assert')
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')
const NewFilter = require('../../src/components/NewFilter/NewFilter.jsx')

describe('NewFilter', () => {
  let renderedDOM

  before(() => {
    const component = TestUtils.renderIntoDocument(<NewFilter />)
    renderedDOM = () => ReactDOM.findDOMNode(component)
  })

  it('shows the form', () => {
    const newFilterForm = renderedDOM().querySelectorAll('.new-filter-form')
    assert.equal(1, newFilterForm.length)
  })

  describe('Create', () => {
    it('has a save button', () => {
      const saveButton = renderedDOM().querySelectorAll('#new-filter-save')
      assert.equal(1, saveButton.length)
    })

    it('has required form fields', () => {
      const valueInput = renderedDOM().querySelectorAll("input[name='filterValue']")
      assert.equal(1, valueInput.length)
    })

    xit('sets a created filter as LastFilter', () => {

    })
  })
})
