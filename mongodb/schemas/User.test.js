const { expect } = require('chai')

describe('User', function () {

  it('Say hello', async function() {
    const name = 'Albert'
    expect(new this.db.User({ name }).sayHello()).to.equal(`Hello, I'm ${name}`)
  })

})
