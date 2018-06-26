//const createDatabase = require('../mongodb/createDatabase.js');
const createExpressApp = require('../app/createExpressApp.js')
const createLogger = require('../createLogger.js')

process.setMaxListeners(0)

//let database;

module.exports = async (that, useLogger) => {

    // database = await createDatabase({ logger: useLogger ? logger : loggerDummy });

    const app = await createExpressApp({
        logger: createLogger(useLogger),
        //        database,
    })

    //    that.db = database;
    that.app = app

}

