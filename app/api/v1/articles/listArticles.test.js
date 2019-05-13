const { expect } = require('chai')
const { intersection } = require('lodash')

describe('GET api/v1/articles/', function () {

  it('return 200 if get all the articles', async function() {
        
    const users = await this.db.User.insertMany([{
      name: 'some user name',
      avatar: 'http://some_url',
    }, {
      name: 'other user name',
      avatar: 'http://other_url',
    }])

    const articles = await this.db.Article.insertMany([{
      userId: users[0].id,
      title: `some title ${users[0].name}`,
      text: 'some text',
      tags: ['some tag', 'other tag'],
    }, {
      userId: users[0].id,
      title: `other title ${users[0].name}`,
      text: 'other text',
    }, {
      userId: users[1].id,
      title: `more title ${users[1].name}`,
      text: 'more text',
      tags: ['other tag'],
    }])

    const { request, body } = await this.request.get('/api/v1/articles')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/api/v1`

    expect(body).to.deep.equal({
      items: articles.map(({ id, title, text, tags, userId }) => ({
        title,
        text,
        tags,
        _links: {
          self: {
            href: `${baseUrl}/users/${userId}/articles/${id}`,
          },
          author: {
            href: `${baseUrl}/users/${userId}`,
          },
        },
      })),
    })

  })

  it('return 200 if get all the articles with a tag', async function() {

    const tag = 'one tag'

    const users = await this.db.User.insertMany([{
      name: 'some user name',
      avatar: 'http://some_url',
    }, {
      name: 'other user name',
      avatar: 'http://other_url',
    }])

    const articles = await this.db.Article.insertMany([{
      userId: users[0].id,
      title: `some title ${users[0].name}`,
      text: 'some text',
      tags: [tag, 'some tag', 'other tag'],
    }, {
      userId: users[0].id,
      title: `other title ${users[0].name}`,
      text: 'other text',
    }, {
      userId: users[1].id,
      title: `more title ${users[1].name}`,
      text: 'more text',
      tags: [tag, 'other tag'],
    }])

    const { request, body } = await this.request.get(`/api/v1/articles?[tags]=${tag}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/api/v1`

    expect(body).to.deep.equal({
      items: articles
        .filter(({ tags }) => tags.includes(tag))
        .map(({ id, title, text, tags, userId }) => ({
          title,
          text,
          tags,
          _links: {
            self: {
              href: `${baseUrl}/users/${userId}/articles/${id}`,
            },
            author: {
              href: `${baseUrl}/users/${userId}`,
            },
          },
        })),
    })

  })

  it('return 200 if get all the articles with two tags', async function() {
        
    const tags = ['one tag', 'two tag']

    const users = await this.db.User.insertMany([{
      name: 'some user name',
      avatar: 'http://some_url',
    }, {
      name: 'other user name',
      avatar: 'http://other_url',
    }])

    const articles = await this.db.Article.insertMany([{
      userId: users[0].id,
      title: `some title ${users[0].name}`,
      text: 'some text',
      tags: [tags[0], 'some tag', 'other tag'],
    }, {
      userId: users[0].id,
      title: `other title ${users[0].name}`,
      text: 'other text',
    }, {
      userId: users[1].id,
      title: `more title ${users[1].name}`,
      text: 'more text',
      tags: [tags[1], 'other tag'],
    }])

    const res = await this.request.get(`/api/v1/articles?tags=${tags[0]}&[tags]=${tags[1]}`)
      .set('Authorization', `Bearer ${this.apiToken}`)
      .expect(200)

    const baseUrl = `${res.request.protocol}//${res.request.host}/api/v1`

    expect(res.body).to.deep.equal({
      items: articles
        .filter(article => intersection(article.tags, tags).length)
        .map(({ id, title, text, tags, userId }) => ({
          title,
          text,
          tags,
          _links: {
            self: {
              href: `${baseUrl}/users/${userId}/articles/${id}`,
            },
            author: {
              href: `${baseUrl}/users/${userId}`,
            },
          },
        })),
    })

  })

  it('return 401 if the user was not authenticated', async function() {
    return this.request.get('/api/v1/articles').expect(401, {})
  })

})
