const { expect } = require('chai')
const { pick } = require('lodash')

describe('POST api/v1/users/:id/articles', function () {

  it('return 201 if the article was created by an existent user', async function() {
        
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })

    const data = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { header, body, request } = await this.request.post(`/api/v1/users/${user.id}/articles`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(201)

    const { location } = header
    expect(location).to.exist
    const id = location.split('/').pop()
    expect(location).to.equal(`${request.url}/${id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: location,
        },
      },
    })

    const article = await this.db.Article.findById(id)

    expect(pick(article, Object.keys(data))).to.deep.equal(data)
    expect(article.userId.toString()).to.equal(user.id)

  })

  it('return 404 if the article was created by an unexistent user', async function() {
    const count = await this.db.Article.countDocuments()
    const { body } = await this.request.post('/api/v1/users/unexistentUserId/articles')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: ['some tag','other tag'],
      })
      .expect(404)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

  it('return 400 if the request has no title', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const count = await this.db.Article.countDocuments()
    const { body } = await this.request.post(`/api/v1/users/${user.id}/articles`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        text: 'some text',
        tags: ['some tag','other tag'],
      })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

  it('return 400 if the request has no text', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const count = await this.db.Article.countDocuments()
    const { body } = await this.request.post(`/api/v1/users/${user.id}/articles`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        tags: ['some tag','other tag'],
      })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

  it('return 400 if the article tag is not an array', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const count = await this.db.Article.countDocuments()
    const { body } = await this.request.post(`/api/v1/users/${user.id}/articles`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: 'some tag',
      })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

  it('return 400 if the request has invalid fields', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const count = await this.db.Article.countDocuments()
    const { body } = await this.request.post(`/api/v1/users/${user.id}/articles`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: ['some tag','other tag'],
        extraField: 'some extra field',
      })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

  it('return 401 if the user was not authenticated', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const count = await this.db.Article.countDocuments()
    await this.request.post(`/api/v1/users/${user.id}/articles`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: ['some tag','other tag'],
      })
      .expect(401, {})
    expect(count).to.equals(await this.db.Article.countDocuments())
  })

})
