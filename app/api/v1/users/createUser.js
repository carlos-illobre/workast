const { Router } = require('express')
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

        const user = await req.db.User.create(req.body)

        const location = `${req.base}${req.originalUrl}/${user.id}`
        res.setHeader('Location', location)

        res.status(201).json(
            halson()
            .addLink('self', location)
            .addLink('createArticle', `${location}/articles`)
            .addLink('listArticles', `${location}/articles`)
        )

    } catch(error) {
        next(error)
    }

})

