const { ApolloServer, gql } = require('apollo-server-express')
const voyagerMiddleware = require('graphql-voyager/middleware').express

const { typeDefs, resolvers } = require('./loadResolvers.js')()
const createOpenTracingExtension = require('./createOpenTracingExtension.js')

module.exports = async ({ app, logger }) => {

  const apollo = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return connection.context
      } else {
        // check from req
        logger.info({ query: req.body })
        return {
          logger,
          token: req.headers.authorization || '',
        }
      }
    },
    playground: process.env.NODE_ENV != 'production' && {
      settings: {
        'tracing.hideTracingResponse': false,
      },
    },
    subscriptions: {
      onConnect: (connectionParams, webSocket, context) => {
        // ...
      },
      onDisconnect: (webSocket, context) => {
        // ...
      },
    },
    formatError: error => {
      logger.error(error)
      return error
    },
    formatResponse: response => {
      logger.info(JSON.stringify(response, null, 2))
      return response
    },
    tracing: true,
    extensions: [createOpenTracingExtension],
  })

  apollo.applyMiddleware({ app })

  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }))

  return apollo

}
