const { expect } = require('chai')
const { pick } = require('lodash')

describe('POST api/v1/users', function () {

  it('return 201 if the user was created', async function() {
        
    const data = {
      name: 'some user name',
      avatar: 'http://some_url',
    }

    const { header, body, request } = await this.request.post('/api/v1/users')
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
        createArticle: {
          href: `${location}/articles`,
        },
        listArticles: {
          href: `${request.protocol}//${request.host}/api/v1/articles`,
        },
      },
    })

    const user = await this.db.User.findById(id)

    expect(pick(user, Object.keys(data))).to.deep.equal(data)

  })

  it('return 400 if the request has no name', async function() {
    const count = await this.db.User.countDocuments()
    const { body } = await this.request.post('/api/v1/users')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({ avatar: 'http://some_url' })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.User.countDocuments())
  })

  it('return 400 if the avatar is not a url', async function() {
    const count = await this.db.User.countDocuments()
    const { body } = await this.request.post('/api/v1/users')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({ name: 'some user name', avatar: 'not_url' })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.User.countDocuments())
  })

  it('return 400 if the request has invalid fields', async function() {
    const count = await this.db.User.countDocuments()
    const { body } = await this.request.post('/api/v1/users')
      .set('Authorization', `Bearer ${this.apiToken}`)
      .send({
        name: 'some user name',
        avatar: 'http://some_url',
        extraField: 'some extra field',
      })
      .expect(400)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.User.countDocuments())
  })

  it('return 401 if the user was not authenticated', async function() {
    const count = await this.db.User.countDocuments()
    const { body } = await this.request.post('/api/v1/users')
      .send({
        name: 'some user name',
        avatar: 'http://some_url',
      })
      .expect(401)
    expect(body).to.matchSnapshot(this)
    expect(count).to.equals(await this.db.User.countDocuments())
  })

})
