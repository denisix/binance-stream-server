const http2 = require('http2')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const host = 'https://127.0.0.1:3000'
const token = 'my-secure-token'

const api = ({ host = 'https://127.0.0.1:3000', path = '/', headers = {} }, cb) => {
	const client = http2.connect(host)
	client.on('error', cb)
	const req = client.request({ ':path': path, ...headers })

	let body = ''
	req.on('response', h => headers = h)
	req.setEncoding('utf8')
	req.on('error', cb)
	req.on('data', c => body += c)
	req.on('end', () => {
		cb(null, { headers, body })
		client.close()
	})
	req.end()
}

// fetch symbols:
api({ host, path: '/symbols', headers: { token } }, console.log)

// fetch trades:
const start = Date.now() - 3600 * 1000
const end = Date.now() - 1
api({ host, path: `/trades/XRPBTC/${start}/${end}`, headers: { token } }, console.log)
