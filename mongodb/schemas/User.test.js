const { expect } = require('chai')
const { model } = require('mongoose')
const User = model('User', require('./User.js'))

describe('User', function () {

    it('Say hello', async function() {
        const name = 'Albert'
        const expected = `Hello, I'm ${name}`
        const actual = new User({ name }).sayHello()
        expect(actual).to.equal(expected)
    })

})
