const { expect } = require('chai')

describe('Article', function () {

  it('Say hello', async function() {
    const user = await this.db.User.create({ name: 'Albert' })
    const { _id: articleId } = await this.db.Article.create({ user })
    const article = await this.db.Article.findOne(articleId).populate('user')
    expect(article.user.sayHello()).to.equal(user.sayHello())
  })

})
