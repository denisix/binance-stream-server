const { strict: assert } = require('assert'),
  api = require('./api'),
  { version } = require('../package.json'),
  host = 'https://localhost:3000',
  token = 'my-secure-token'

describe("base", () => {
  it('server is alive', done => {
    api({ host, path: '/' }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data?.headers?.status, '403')
      assert.equal(data?.body, 'Access denied')
      done()
    })
  })

  it('server version', done => {
    api({ host, path: '/version' }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data?.headers?.status, '200')
      assert.equal(data?.body, version)
      done()
    })
  })

  it('no method', done => {
    api({ host, path: '/', headers: { token } }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data?.headers?.status, '404')
      assert.equal(data?.body, 'No such method')
      done()
    })
  })
})