const request = require('supertest')
const { expect } = require('chai')

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)

describe('DELETE api/v1/users/:id/articles', function () {

    beforeEach(async function() {
        await createTestApp(this)
    })

    it('return 204 if the article was deeted', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const article = await this.db.Article.create({
            userId: user.id,
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        })

        await request(this.app)
        .delete(`/api/v1/users/${user.id}/articles/${article.id}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .expect(204, {})
        
        const exists = await this.db.Article.countDocuments({_id: article.id})
        expect(exists).to.equal(0)

    })

    it('return 500 if internal error', async function() {
        
        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const article = await this.db.Article.create({
            userId: user.id,
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        })

        delete this.db.Article

        await request(this.app)
        .delete(`/api/v1/users/${user.id}/articles/${article.id}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .expect(500)

    })

    it('return 404 if the article does not exist', async function() {

        const unexistentArticleId = 'xxx'

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        await request(this.app)
        .delete(`/api/v1/users/${user.id}/articles/${unexistentArticleId}`)
        .set('Authorization', `Bearer ${this.apiToken}`)
        .expect(404, {
            error: {
                message: `The article ${unexistentArticleId} was not found.`,
                status: 404,
            },
        })
        
    })

    it('return 401 if the user was not authenticated', async function() {

        const user = await this.db.User.create({
            name: 'some user name',
            avatar: 'http://some_url',
        })

        const article = await this.db.Article.create({
            userId: user.id,
            title: 'some title',
            text: 'some text',
            tags: [
                'some tag',
                'other tag',
            ],
        })

        await request(this.app)
        .delete(`/api/v1/users/${user.id}/articles/${article.id}`)
        .expect(401)

        const exists = await this.db.Article.countDocuments({_id: article.id})
        expect(exists).to.equal(1)

    })

})
