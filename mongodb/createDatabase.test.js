const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)
const createDatabase = require('./createDatabase.js')

describe('Create database', function () {

    beforeEach(function() {
        return createTestApp(this)
    })

    it('create a database instance using the default mongoose instance', async function() {
        await createDatabase({
            logger: {
                info() {},
            },
        })
    })

})
