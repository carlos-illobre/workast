require('chai').use(require('mocha-chai-snapshot'))
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const createDatabase = require('../mongodb/createDatabase.js')
const createExpressApp = require('../app/createExpressApp.js')
const createLogger = require('../createLogger.js')
const createApolloServer = require('../graphql/createApolloServer.js')

require('events').EventEmitter.defaultMaxListeners = 0

before(async function() {
    this.mongoServer = new MongoMemoryServer()
    this.apiToken = process.env.API_TOKEN
})

beforeEach(async function() {
    const logger = createLogger({ silent: true })
    this.db = await createDatabase({ mongoUri: await this.mongoServer.getConnectionString(), logger })
    const app = await createExpressApp({ database: this.db, logger })
    const apollo = await createApolloServer({ app, logger })
    this.request = request(app)
})

after(async function() {
    await this.mongoServer.stop()
})

afterEach(async function() {
    await this.db.mongoose.connection.db.dropDatabase()
    await this.db.mongoose.disconnect()
})
