const express = require('express')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')

const apiRouter = require('./api/createApiRouter.js')()
const swaggerDocument = require('./getSwaggerDocument.js')()

module.exports = async ({database, logger}) => express()
    .use(expressWinston.logger({
        winstonInstance: logger,
        msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms querystring={{JSON.stringify(req.query)}} response body:{{JSON.stringify(res.body)}}',
        meta: false,
    }))
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true))
    .use((req, res, next) => {
        req.base = `${req.protocol}://${req.get('host')}`
        req.logger = logger
        req.db = database
        return next()
    })
    .use(cors())
    .options('*', cors())
    .use('/api', apiRouter)
    .use((error, req, res, next) => {
            
        if (!error.status || error.status >= 500 || error.status == 400) {
            logger.error(error, error)
        }

        res.status(error.status || 500).send({
            error: error.message,
        })
                            
    })
