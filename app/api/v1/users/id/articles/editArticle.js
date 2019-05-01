const { Router } = require('express')
const validate = require('express-validation')
const Joi = require('joi')

module.exports = Router({mergeParams: true})
.patch('/v1/users/:userId/articles/:articleId', validate({
    options: {
        allowUnknownBody: false,
    },
    body: Joi.object({
        title: Joi.string(),
        text: Joi.string(),
        tags: Joi.array().items(
            Joi.string()
        ),
    }).min(1).label('The request'),
}), async (req, res, next) => {
    
    try {
        
        await req.db.Article.updateOne({
            _id: req.params.articleId,
        }, {
            $set: req.body,
        })

        res.sendStatus(204)
        
    } catch(error) {
        
        if (error.kind == 'ObjectId') {
            next({
                message: `The article ${req.params.articleId} was not found.`,
                status: 404,
            })
        } else {
            next(error)
        }
    }

})
