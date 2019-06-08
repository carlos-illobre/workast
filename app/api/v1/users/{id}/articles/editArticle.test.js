const { expect } = require('chai')
const { pick } = require('lodash')

describe('PATCH api/v1/users/:userId/articles/:articleId', function () {

  it('return 201 if the article was edited', async function() {
        
    const user = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag', 'other tag'],
    }

    const { id } = await this.db.Article.create({ user, ...articleData })

    const data = {
      text: 'other text',
      tags: ['another tag'],
    }

    await this.request.patch(`/api/v1/users/${user.id}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(204, {})
         
    const article = await this.db.Article.findById(id).populate('user')

    expect(pick(article, Object.keys(articleData))).to.deep.equal({ ...articleData, ...data })
    expect(article.user.id).to.equal(user.id)

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

    const user = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ user, ...articleData })

    const { body } = await this.request.patch(`/api/v1/users/${user.id}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({})
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id).populate('user')
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.user.id).to.equal(user.id)

  })

  it('return 400 if the article tag is not an array', async function() {

    const user = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ user, ...articleData })

    const data = {
      title: 'some title',
      text: 'some text',
      tags: 'some tag',
    }

    const { body } = await this.request.patch(`/api/v1/users/${user.id}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id).populate('user')
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.user.id).to.equal(user.id)

  })

  it('return 400 if the request has invalid fields', async function() {

    const user = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ user, ...articleData })

    const data = { extraField: 'some extra field' }

    const { body } = await this.request.patch(`/api/v1/users/${user.id}/articles/${id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send(data)
      .expect(400)
    expect(body).to.matchSnapshot(this)

    const article = await this.db.Article.findById(id).populate('user')
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.user.id).to.equal(user.id)

  })

  it('return 401 if the user was not authenticated', async function() {

    const user = await this.db.User.create({name: 'some user name', avatar: 'http://some_url'})

    const articleData = {
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    }

    const { id } = await this.db.Article.create({ user, ...articleData })

    await this.request.patch(`/api/v1/users/${user.id}/articles/${id}`)
      .send(articleData)
      .expect(401, {})

    const article = await this.db.Article.findById(id).populate('user')
    expect(pick(article, Object.keys(articleData))).to.deep.equal(articleData)
    expect(article.user.id).to.equal(user.id)

  })

})
