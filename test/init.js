require('chai').use(require('mocha-chai-snapshot'))
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
require('events').EventEmitter.defaultMaxListeners = 0

before(async function() {
  this.timeout(5000)
  Object.defineProperty(this, 'apiToken', { value: process.env.API_TOKEN, writable: false })
  Object.defineProperty(this, 'mongoServer', { value: new MongoMemoryServer(), writable: false })
  process.env.MONGODB_URI = await this.mongoServer.getConnectionString()
  const { server, db } = await require('../server.js')
  Object.defineProperty(this, 'server', { value: server, writable: false })
  Object.defineProperty(this, 'db', { value: Object.freeze(db), writable: false })
  Object.defineProperty(this, 'request', { value: request(server), writable: false })
})

afterEach(async function() {
  await this.db.mongoose.connection.db.dropDatabase()
})

after(async function() {
  this.server.close()
  await this.db.mongoose.disconnect()
  await this.mongoServer.stop()
})
