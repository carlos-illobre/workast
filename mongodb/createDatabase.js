const { sync } = require('glob')
const { basename, extname } = require('path')
const { chain } = require('lodash')
const mongoose = require('mongoose')
const ACL = require('acl')
const createUmzug = require('./createUmzug.js')

module.exports = async ({ logger }) => {

  mongoose.set('debug', (coll, method, query, doc, options) => {
    logger.info(JSON.stringify({ coll, method, query, options }, null, 2))
  })
    
  const db = chain(sync('./schemas/**/*.js', {
    cwd: __dirname,
    ignore: ['./schemas/**/*.test.js','./schemas/**/__snapshots__/*'],
  }))
    .map(filename => ({
      schema: require(filename),
      name: basename(filename).replace(extname(filename), ''),
    }))
    .filter(({ schema }) => schema instanceof mongoose.Schema)
    .map(({ name, schema }) => mongoose.model(name, schema))
    .reduce((db, model) => ({ ...db, [model.modelName]: model }), {})
    .value()

  mongoose.connection.once('open', () => logger.info(`MongoDB connected at ${process.env.MONGODB_URI}`))

  db.mongoose = await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

  db.acl = new ACL(new ACL.mongodbBackend(db.mongoose.connection.db, '_acl'))

  await createUmzug({ db, logger }).up()

  return db

}
