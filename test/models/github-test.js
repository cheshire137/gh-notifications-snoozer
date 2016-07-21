const assert = require('assert')
const fs = require('fs')
const path = require('path')

const GitHub = require('../../src/models/github')

describe('GitHub', () => {
  describe('getToken', () => {
    it('returns contents of .env file', () => {
      const tokenPath = path.join(__dirname, '..', '..', '.env')
      const expected = fs.readFileSync(tokenPath).toString().trim()
      assert.equal(expected, GitHub.getToken())
    })
  })
})
