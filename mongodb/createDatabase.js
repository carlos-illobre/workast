const glob = require('glob')
const path = require('path')
const { chain } = require('lodash')
const createUmzug = require('./createUmzug.js')

module.exports = async ({
    logger,
    mongoose = require('mongoose'),
}) => {

    const url = process.env.MONGODB_URL
    
    mongoose.set('debug', (coll, method, query, doc, options) => {
        logger.info(JSON.stringify({ coll, method, query, options }, null, 2))
    })
    
    const db = chain(glob.sync('./schemas/**/*.js', { cwd: __dirname }))
    .filter(filename => !filename.endsWith('.test.js'))
    .map(filename => ({
        schema: require(filename),
        name: path.basename(filename).replace(path.extname(filename), ''),
    }))
    .filter(({ schema }) => schema instanceof mongoose.Schema)
    .map(({ name, schema }) => mongoose.model(name, schema))
    .reduce((db, model) => ({
        ...db,
        [model.modelName]: model,
    }), {})
    .value()

    mongoose.connection.once('open', () => logger.info(`MongoDB connected at ${url}`))

    db.mongoose = await mongoose.connect(url, {useNewUrlParser: true})

    await createUmzug({ db, connection: db.mongoose.connections[0], logger }).up()

    return db

}
