const glob = require('glob')
const path = require('path')
const { chain } = require('lodash')

module.exports = async ({
    logger,
    mongoose = require('mongoose'),
}) => {

    const url = process.env.MONGODB_URL
    
    mongoose.set('debug', (coll, method, query, doc, options = {}) => {
        logger.info(`${coll},${method},${JSON.stringify(query)},${JSON.stringify(options)}`)
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

    db.mongoose = mongoose
    
    await mongoose.connect(url, {useNewUrlParser: true})

    return db

}
