const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy

passport.use(
    new BearerStrategy(
        (token, done) => done(null, token == process.env.API_TOKEN)
    )
)

module.exports = passport.authenticate('bearer', { session: false })
