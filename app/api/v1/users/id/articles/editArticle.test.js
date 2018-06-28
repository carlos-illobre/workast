const request = require('supertest')
const _ = require('lodash')
const { expect } = require('chai')

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)

describe('PATCH api/v1/users/:userId/articles/:articleId', function () {

    beforeEach(async function() {
        await createTestApp(this)
    })

    it('return 201 if the article was edited', async function() {
        
        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const articleData = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const { _id } = await this.db.Article.create({
            userId: user.id,
            ...articleData,
        })

        const data = {
            text: 'other text',
            tags: [
                'another tag',
            ],
        }

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/${_id}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(204)
         
        const article = await this.db.Article.findById(_id)

        expect(_.pick(article, Object.keys(articleData))).to.deep.equal({
            ...articleData,
            ...data,
        })

        expect(article.userId._id.toString()).to.equal(user._id.toString())

    })

    it('return 500 if internal error', async function() {
        
        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        delete this.db.Article

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/1`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(500)

    })

    it('return 404 if the article does not exist', async function() {

        const unexistentArticleId = 'xxx'

        await request(this.app)
        .patch(`/api/v1/users/1/articles/${unexistentArticleId}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send({
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        })
        .expect(404, {
            error: {
                message: `The article ${unexistentArticleId} was not found.`,
                status: 404,
            },
        })
        
    })

    it('return 400 if the request has no values', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const articleData = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const { _id } = await this.db.Article.create({
            userId: user.id,
            ...articleData,
        })

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/${_id}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send({})
        .expect(400, {
            error: {
                errors: [{
                    field: [],
                    location: 'body',
                    messages: [
                        '"The request" must have at least 1 children',
                    ],
                    types: [
                        'object.min',
                    ],
                }],
                'status': 400,
                'statusText': 'Bad Request',
            },
        })

        const article = await this.db.Article.findById(_id)
        expect(_.pick(article, Object.keys(articleData))).to.deep.equal(articleData)
        expect(article.userId._id.toString()).to.equal(user.id)

    })

    it('return 400 if the article tag is not an array', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const articleData = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const { _id } = await this.db.Article.create({
            userId: user.id,
            ...articleData,
        })

        const data = {
            title: 'some title',
            text: 'some text',
            tags: 'some tag',
        }

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/${_id}`)
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

        const article = await this.db.Article.findById(_id)
        expect(_.pick(article, Object.keys(articleData))).to.deep.equal(articleData)
        expect(article.userId._id.toString()).to.equal(user.id)

    })

    it('return 400 if the request has invalid fields', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const articleData = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const { _id } = await this.db.Article.create({
            userId: user.id,
            ...articleData,
        })

        const data = {
            extraField: 'some extra field',
        }

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/${_id}`)
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

        const article = await this.db.Article.findById(_id)
        expect(_.pick(article, Object.keys(articleData))).to.deep.equal(articleData)
        expect(article.userId._id.toString()).to.equal(user.id)

    })

    it('return 401 if the user was not authenticated', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const articleData = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        const { _id } = await this.db.Article.create({
            userId: user.id,
            ...articleData,
        })

        const data = {
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        }

        await request(this.app)
        .patch(`/api/v1/users/${user.id}/articles/${_id}`)
        .send(data)
        .expect(401)

        const article = await this.db.Article.findById(_id)
        expect(_.pick(article, Object.keys(articleData))).to.deep.equal(articleData)
        expect(article.userId._id.toString()).to.equal(user.id)

    })

})
