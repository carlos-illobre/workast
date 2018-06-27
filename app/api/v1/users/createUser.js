const { Router } = require('express')
//const apiTokenAuth = require(`${process.env.PWD}/app/auth/apiTokenAuthMiddleware.js`);
const halson = require('halson')
const validate = require('express-validation')
const Joi = require('joi')

module.exports = Router({mergeParams: true})
.post('/v1/users', validate({
    options: {
        allowUnknownBody: false,
    },
    body: {
        name: Joi.string().required(),
        avatar: Joi.string().uri(),
    },
}), async (req, res, next) => {

    try {

        const user = new req.db.User(req.body)
        await user.save()

        const location = `${req.base}${req.originalUrl}/${user.id}`
        res.setHeader('Location', location)

        res.status(201).json(
            halson({ id: user.id })
            .addLink('self', location)
        )

    } catch(error) {
        next(error)
    }

})

