const { Router } = require('express')
const halson = require('halson')
const validate = require('express-validation')
const Joi = require('joi')

module.exports = Router({mergeParams: true})
  .post('/v1/users/:userId/articles', validate({
    options: {
      allowUnknownBody: false,
    },
    body: {
      title: Joi.string().required(),
      text: Joi.string().required(),
      tags: Joi.array().items(
        Joi.string()
      ),
    },
  }), async (req, res, next) => {

    try {

      const user = await req.db.User.findById(req.params.userId)

      const article = await req.db.Article.create({
        ...req.body,
        userId: user.id,
      })

      const location = `${req.base}${req.originalUrl}/${article.id}`
      res.setHeader('Location', location)

      res.status(201).json(
        halson()
          .addLink('self', location)
      )

    } catch(error) {
      if (error.kind == 'ObjectId') {
        next({
          message: `The user ${req.params.userId} was not found.`,
          status: 404,
        })
      } else {
        next(error)
      }
    }

  })
