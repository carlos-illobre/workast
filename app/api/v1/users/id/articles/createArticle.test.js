const request = require('supertest')
const _ = require('lodash')
const { expect } = require('chai')

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)

describe('POST api/v1/users', function () {

    beforeEach(async function() {
        await createTestApp(this)
    })

    it('return 201 if the article was created by an existent user', async function() {
        
        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const res = await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(201)
        
        expect(res.header.location).to.exist
        const id = res.header.location.split('/').pop()
        expect(res.header.location).to.equal(`${res.request.url}/${id}`)
        expect(res.body).to.deep.equal({
            id,
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        })

        const article = await this.db.Article.findById(id)

        expect(_.pick(article, Object.keys(data))).to.deep.equal(data)
        expect(article.userId._id.toString()).to.equal(user.id)

    })

    it('return 404 if the article was created by an unexistent user', async function() {

        const originalCount = await this.db.Article.count()

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const unexistentUserId = 'unexistendUserId'

        await request(this.app)
        .post(`/api/v1/users/${unexistentUserId}/articles`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(404, {
            error: {
                message: `The user ${unexistentUserId} was not found.`,
                status: 404,
            },
        })
        
        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the request has no title', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const originalCount = await this.db.Article.count()

        const data = {
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'title',
                    ],
                    location: 'body',
                    messages: [
                        '"title" is required',
                    ],
                    types: [
                        'any.required',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the request has no text', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const originalCount = await this.db.Article.count()

        const data = {
            title: 'some title',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'text',
                    ],
                    location: 'body',
                    messages: [
                        '"text" is required',
                    ],
                    types: [
                        'any.required',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the article tag is not an array', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const originalCount = await this.db.Article.count()

        const data = {
            title: 'some title',
            text: 'some text',
            tags: 'some tag',
        }

        await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(400, {
            error: {
                errors: [{
                    field: [
                        'tags',
                    ],
                    location: 'body',
                    messages: [
                        '"tags" must be an array',
                    ],
                    types: [
                        'array.base',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

    it('return 400 if the request has invalid fields', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const originalCount = await this.db.Article.count()

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
            extraField: 'some extra field',
        }

        await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
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

        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

    it('return 401 if the user was not authenticated', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const originalCount = await this.db.Article.count()

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        await request(this.app)
        .post(`/api/v1/users/${user.id}/articles`)
        .send(data)
        .expect(401)

        const newCount = await this.db.Article.count()

        expect(originalCount).to.equals(newCount)

    })

})
