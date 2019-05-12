const { expect } = require('chai')

describe('DELETE api/v1/users/:id/articles', function () {

  it('return 204 if the article was deeted', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const article = await this.db.Article.create({
      userId: user.id,
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    })
    await this.request.delete(`/api/v1/users/${user.id}/articles/${article.id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(204, {})
    expect(await this.db.Article.countDocuments({ _id: article.id })).to.not.be.ok
  })

  it('return 500 if internal error', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const article = await this.db.Article.create({
      userId: user.id,
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    })
    delete this.db.Article
    await this.request.delete(`/api/v1/users/${user.id}/articles/${article.id}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(500)
  })

  it('return 404 if the article does not exist', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const { body } = await this.request.delete(`/api/v1/users/${user.id}/articles/xxx`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(404)
    expect(body).to.matchSnapshot(this)
  })

  it('return 401 if the user was not authenticated', async function() {
    const user = await this.db.User.create({ name: 'some user name', avatar: 'http://some_url' })
    const article = await this.db.Article.create({
      userId: user.id,
      title: 'some title',
      text: 'some text',
      tags: ['some tag','other tag'],
    })
    await this.request.delete(`/api/v1/users/${user.id}/articles/${article.id}`).expect(401, {})
    expect(await this.db.Article.countDocuments({_id: article.id})).to.be.ok
  })

})
