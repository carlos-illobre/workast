const request = require('supertest')

describe('Create Express Application', function () {

    it('Returns 404 if the url does not exist', function() {
        return request(this.app)
        .get('/some/invalid/url')
        .expect(404, {})
    })

})

