const request = require('supertest')
const _ = require('lodash')
const { expect } = require('chai')

describe('POST api/v1/users', function () {

    it('return 201 if the user was created', async function() {
        
        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
        }

        const res = await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(201)
        
        expect(res.header.location).to.exist
        const id = res.header.location.split('/').pop()
        expect(res.header.location).to.equal(`${res.request.url}/${id}`)
        expect(res.body).to.deep.equal({
            _links: {
                self: {
                    href: res.header.location,
                },
                createArticle: {
                    href: `${res.header.location}/articles`,
                },
                listArticles: {
                    href: `${res.request.protocol}//${res.request.host}/api/v1/articles`,
                },
            },
        })

        const user = await this.db.User.findById(id)

        expect(_.pick(user, Object.keys(data))).to.deep.equal(data)

    })

    it('return 500 if internal error', async function() {
        
        delete this.db.User

        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
        }

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(500)

    })

    it('return 400 if the request has no name', async function() {

        const originalCount = await this.db.User.countDocuments()

        const data = {
            avatar: 'http://some_url',
        }

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'name',
                    ],
                    location: 'body',
                    messages: [
                        '"name" is required',
                    ],
                    types: [
                        'any.required',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.User.countDocuments()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the avatar is not a url', async function() {

        const originalCount = await this.db.User.countDocuments()

        const data = {
            name: 'some user name',
            avatar: 'not_url',
        }

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'avatar',
                    ],
                    location: 'body',
                    messages: [
                        '"avatar" must be a valid uri',
                    ],
                    types: [
                        'string.uri',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.User.countDocuments()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the request has invalid fields', async function() {

        const originalCount = await this.db.User.countDocuments()

        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
            extraField: 'some extra field',
        }

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'extraField',
                    ],
                    location: 'body',
                    messages: [
                        '"extraField" is not allowed',
                    ],
                    types: [
                        'object.allowUnknown',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.User.countDocuments()

        expect(originalCount).to.equals(newCount)
    })

    it('return 401 if the user was not authenticated', async function() {

        const originalCount = await this.db.User.countDocuments()

        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
        }

        await request(this.app)
        .post('/api/v1/users')
        .send(data)
        .expect(401, {})

        const newCount = await this.db.User.countDocuments()
        
        expect(originalCount).to.equals(newCount)

    })

})
