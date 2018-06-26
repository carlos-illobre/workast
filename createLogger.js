const winston = require('winston')

module.exports = ({silent} = {}) => winston.createLogger({
    silent,
    transports: [
        new winston.transports.Console({
            name: 'error-console',
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            exitOnError: true,
        }),
        new winston.transports.File({
            name: 'debug-file',
            filename: 'log.log',
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            exitOnError: true,
            json: false,
            maxsize: 104857600,
            maxFiles: 5,
        }),
    ],
})
