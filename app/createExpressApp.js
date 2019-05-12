const express = require('express')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const apiRouter = require('./api/createApiRouter.js')()
const authApiTokenMiddleware = require('./auth/authApiTokenMiddleware.js')

module.exports = async ({ database, logger }) => express()
  .use(expressWinston.logger({
    winstonInstance: logger,
    msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
    meta: false,
  }))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
    swaggerDefinition: {
      info: { title: 'Api Documentation', version: '1.0.0' },
      basePath: '/api',
    },
    apis: ['./app/api/**/*.yml'],
  }), true))
  .use((req, res, next) => {
    req.base = `${req.protocol}://${req.get('host')}`
    req.logger = logger
    req.db = database
    return next()
  })
  .use('/api', authApiTokenMiddleware, apiRouter)
  .use((error, req, res, next) => {
    error.status = error.status || 500
    logger.error(error, error)
    res.status(error.status).json({ error })
  })
