const createDatabase = require('../mongodb/createDatabase.js')
const createExpressApp = require('../app/createExpressApp.js')
const createLogger = require('../createLogger.js')
const mongoose = require('mongoose')
const { Mockgoose } = require('mockgoose')

require('events').EventEmitter.defaultMaxListeners = 0

let mockgoose

module.exports = async (that, useLogger) => {

    if (!mockgoose) {
        mockgoose = new Mockgoose(mongoose)
        await mockgoose.prepareStorage()
    }

    const logger = createLogger({ silent: !useLogger })
    that.apiToken = process.env.API_TOKEN
    that.db = await createDatabase({ logger, mongoose })
    that.app = await createExpressApp({ logger, database: that.db })
    that.db.reset = async () => Promise.all(
        Object
        .values(that.db)
        .filter(object => object.base instanceof mongoose.constructor)
        .map(schema => schema.deleteMany())
    )

    await that.db.reset()

}
