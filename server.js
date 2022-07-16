const fs = require('fs'),
  http2 = require('http2'),
  { createGzip } = require('zlib'),
  { stringify } = require('csv-stringify'),
  initDb = require('./db'),
  log = require('./log'),
  { version } = require('./package.json')

const {
  SSL_CRT = 'server.crt',
  SSL_KEY = 'server.key',
  MYSQL_HOST = '127.0.0.1',
  MYSQL_USER = 'root',
  MYSQL_PW = '',
  MYSQL_DB = 'trade',
  PORT = 3000,
  TOKEN = 'my-secure-token',
  LIMIT = 100000,
} = process.env

let p

const sql = 'SELECT t,c,p,q,m,b,a FROM ticks WHERE s=? AND t>=? AND t<=? LIMIT ?'

const run = async () => {
  log('- starting run()..')
  p = await initDb({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PW,
    database: MYSQL_DB,
  })

  log('- starting server')
  const server = http2.createSecureServer({
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CRT)
  })

  log('- dump symbols')
  let [symbols] = await p.promise().query({ sql: 'SELECT s FROM symbols ORDER BY s', rowsAsArray: true })
  symbols = symbols.map(i => i[0])

  server.on('error', (err) => console.error('- server err:', err))

  server.on('stream', async (stream, headers) => {
    const head = {
      'content-type': 'text/html; charset=utf-8',
      ':status': 200,

      // CORS headers to allow browsers accessing data
      'access-control-allow-origin': headers.origin,
      'vary': 'Origin',
    }

    const path = headers[':path'].split('/')

    // VERSION (publicly available)
    if (path[1] === 'version') {
      log('- version')
      stream.respond({ status: 200, 'content-type': 'text/plain' })
      return stream.end(version)
    }

    // ACL
    if (!headers.token || headers.token !== TOKEN) {
      stream.respond({ status: 403, 'content-type': 'text/plain' })
      return stream.end('Access denied')
    }

    // SYMBOLS (private):
    if (path[1] === 'symbols') {
      log('- symbols')
      const stringifier = stringify([symbols])
      stream.respond(head)
      return stringifier.pipe(stream)
    }

    // TRADES (private)
    if (path[1] === 'trades' && path.length === 5) {
      let [_, __, s,  start, end] = path
      start = +start
      end = +end

      if (!s || !symbols.includes(s)) {
        stream.respond({ status: 400, 'content-type': 'text/plain' })
        return stream.end('invalid - symbol')
      }
      if (!start || (start < 165*10**10 || start > Date.now())) { // invalid date
        stream.respond({ status: 400, 'content-type': 'text/plain' })
        return stream.end('invalid - start')
      }
      if (!end || (end < 165*10**10 || end > Date.now())) { // invalid date
        stream.respond({ status: 400, 'content-type': 'text/plain' })
        return stream.end('invalid - end')
      }

      log('- trades', s, start, end)

      const stringifier = stringify()
      const l = p.query({ sql, values: [s, start, end, LIMIT], rowsAsArray: true }).stream({ highWaterMark: 5 }).pipe(stringifier)

      const title = ['time', 'count', 'price', 'quantity', 'side', 'buyId', 'sellId'].join(',') + '\n'

      if (headers['accept-encoding'] && headers['accept-encoding'].match(/gzip/)) {
        // gzipped:
        head['Content-Encoding'] = 'gzip'
        stream.respond(head)
        l.pipe(createGzip({ windowBits: 15, level: 9, chunkSize: 64 * 1024 })).pipe(stream)
      } else {
        // plain text
        stream.respond(head)
        stream.write(title)
        l.pipe(stream)
      }
      return
    }

    // no such method
    stream.respond({ status: 404, 'content-type': 'text/plain' })
    stream.end('No such method')
  })

  server.listen(PORT, () => log('- listeding on port', PORT))
}

run()