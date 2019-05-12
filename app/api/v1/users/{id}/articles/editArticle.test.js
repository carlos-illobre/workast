const { expect } = require('chai')
const { pick } = require('lodash')

describe('PATCH api/v1/users/:userId/articles/:articleId', function () {

  it('return 201 if the article was edited', async function() {
        
    const { id:userId } = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag', 'other tag'],
    }

    const { id } = await this.db.Article.create({ userId, ...articleData })

    const data = {
      text: 'other text',
      tags: ['another tag'],
    }

    await this.request.patch(`/api/v1/users/${userId}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(204, {})
         
    const article = await this.db.Article.findById(id)

    expect(pick(article, Object.keys(articleData))).to.deep.equal({ ...articleData, ...data })
    expect(article.userId.toString()).to.equal(userId)

  })

  it('return 500 if internal error', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    delete this.db.Article
    return this.request.patch(`/api/v1/users/${user.id}/articles/1`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: ['some tag','other tag'],
      })
      .expect(500)
  })

  it('return 404 if the article does not exist', async function() {
    const { body } = await this.request.patch('/api/v1/users/1/articles/xxx')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        title: 'some title',
        text: 'some text',
        tags: ['some tag','other tag'],
      })
      .expect(404)
    expect(body).to.matchSnapshot(this)
  })

  it('return 400 if the request has no values', async function() {

    const { id:userId } = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ userId, ...articleData })

    const { body } = await this.request.patch(`/api/v1/users/${userId}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({})
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id)
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.userId.toString()).to.equal(userId)

  })

  it('return 400 if the article tag is not an array', async function() {

    const { id:userId } = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ userId, ...articleData })

    const data = {
      title: 'some title',
      text: 'some text',
      tags: 'some tag',
    }

    const { body } = await this.request.patch(`/api/v1/users/${userId}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id)
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.userId.toString()).to.equal(userId)

  })

  it('return 400 if the request has invalid fields', async function() {

    const { id:userId } = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ userId, ...articleData })

    const data = { extraField: 'some extra field' }

    const { body } = await this.request.patch(`/api/v1/users/${userId}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id)
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.userId.toString()).to.equal(userId)

  })

  it('return 401 if the user was not authenticated', async function() {

    const { id:userId } = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ userId, ...articleData })

    await this.request.patch(`/api/v1/users/${userId}/articles/${id}`)
      .send(articleData)
      .expect(401, {})

    const article = await this.db.Article.findById(id)
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.userId.toString()).to.equal(userId)

  })

})
