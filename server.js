const PORT = process.env.PORT || 8080

const http = require('http')
const logger = require('./createLogger.js')()
const createDatabase = require('./mongodb/createDatabase.js')
const createExpressApp = require('./app/createExpressApp.js')
const createApolloServer = require('./graphql/createApolloServer.js')

module.exports = (async () => {

  const db = await createDatabase({ logger })
  const app = await createExpressApp({ logger, db })
  const apollo = await createApolloServer({ app, logger })

  return new Promise((resolve, reject) => {

    const server = http.createServer()
      .on('request', app)
      .on('error', function(error) {
        if (error.syscall !== 'listen') return reject(error)
        const addr = this.address() || { port: PORT }
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
          logger.error(error)
          break
        }
      })

    apollo.installSubscriptionHandlers(server)

    server.listen(PORT, () => {
      logger.info(`REST server ready at http://localhost:${PORT}/api/docs`)
      logger.info(`Graphql server ready at http://localhost:${PORT}${apollo.graphqlPath}`)
      logger.info(`Subscriptions ready at ws://localhost:${PORT}${apollo.subscriptionsPath}`)
      logger.info('Zipkin ready at http://localhost:9411/zipkin/')
      return resolve({ server, db })
    })

  })

})()
