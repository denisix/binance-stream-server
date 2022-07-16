const { strict: assert } = require('assert'),
  api = require('./api'),
  { version } = require('../package.json'),
  host = 'https://localhost:3000',
  token = 'my-secure-token'

describe("api", () => {
  it('symbols', done => {
    api({ host, path: '/symbols', headers: { token } }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data?.headers?.[':status'], 200)
      assert.equal(data?.body?.length > 200, true)
      done()
    })
  })

  it('trades', done => {
    const start = Date.now() - 3600 * 1000
    const end = Date.now() - 1
    api({ host, path: `/trades/XRPBTC/${start}/${end}`, headers: { token } }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data?.headers?.[':status'], 200)
      assert.equal(data?.body?.length > 200, true)
      done()
    })
  })
})
