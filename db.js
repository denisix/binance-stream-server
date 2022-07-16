const db = require('mysql2'),
  log = require('./log')

const initDb = async ({ host, user, password, database }) => {
  p = db.createPool({
    host,
    user,
    password,
    database,
    connectionLimit: 100,
    multipleStatements: true,
    waitForConnections: true,
    queueLimit: 0,
  })

  log('- DB: connect..')
  p.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') return console.error('Database connection was closed.')
      if (err.code === 'ER_CON_COUNT_ERROR') return console.error('Database has too many connections.')
      if (err.code === 'ECONNREFUSED') return console.error('Database connection was refused.')
      log('- DB connection err ->', err)
    }
    if (connection) connection.release()
  })

  return p
}

module.exports = initDb
