const glob = require('glob')
const path = require('path')

module.exports = async ({
    logger,
    mongoose = require('mongoose'),
}) => {

    const url = process.env.MONGODB_URL

    mongoose.connect(url)

    const db = glob.sync('./schemas/**/*.js', { cwd: __dirname })
    .map(filename => {
        return {
            schema: require(filename),
            name: path
            .basename(filename)
            .replace(path.extname(filename), ''),
        }
    })
    .map(({name, schema}) => mongoose.model(name, schema))
    .reduce((db, model) => {
        return {
            ...db,
            [model.modelName]: model,
        }
    }, {})

    mongoose
    .connection
    .on('error', error => {
        throw error
    })
    .once('open', () => logger.info(`MongoDB connected at ${url}`))

    db.mongoose = mongoose

    return db

}

