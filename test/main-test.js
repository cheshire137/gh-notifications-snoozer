const Application = require('spectron').Application
const assert = require('assert')

describe('application launch', () => {
  this.timeout(10000)

  beforeEach(() => {
    this.app = new Application({
      path: '/Applications/MyApp.app/Contents/MacOS/MyApp'
    })
    return this.app.start()
  })

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', () => {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})
