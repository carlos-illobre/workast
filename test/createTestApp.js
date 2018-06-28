const createDatabase = require('../mongodb/createDatabase.js')
const createExpressApp = require('../app/createExpressApp.js')
const createLogger = require('../createLogger.js')
const mongoose = require('mongoose')
const { Mockgoose } = require('mockgoose')
const mockgoose = new Mockgoose(mongoose)

process.setMaxListeners(0)
//process.on('warning', e => { debugger });
require('events').EventEmitter.defaultMaxListeners = 0

let loaded = false

module.exports = async (that, useLogger) => {

    if (!loaded) {
        await mockgoose.prepareStorage()
        loaded = true
    }

    const logger = createLogger({ silent: !useLogger })
    that.apiToken = process.env.API_TOKEN
    that.db = await createDatabase({ logger, mongoose })
    that.app = await createExpressApp({ logger, database: that.db })
    that.closeMongo = async () => {
        const childProcess = mockgoose.mongodHelper.mongoBin.childProcess
        await Promise.all(
            mongoose.connections.map(connection => connection.close())
        )
        childProcess.kill()
    }

}
