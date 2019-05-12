const port = process.env.PORT || 8080

const http = require('http')
const logger = require('./createLogger.js')()
const createDatabase = require('./mongodb/createDatabase.js')
const createExpressApp = require('./app/createExpressApp.js')

module.exports = (async () => {

  const database = await createDatabase({ logger, mongoUri: process.env.MONGODB_URL })
  const app = await createExpressApp({ logger, database })

  return http.createServer()
    .on('request', app)
    .on('listening', function() {
      const addr = this.address()
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      logger.info(`Listening on ${bind}`)
    })
    .on('error', function(error) {
      if (error.syscall !== 'listen') throw error
      const addr = this.address() || { port }
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
      }
    })
    .listen(port)

})()
