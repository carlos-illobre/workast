const { Router } = require('express')

module.exports = Router({mergeParams: true})
.delete('/v1/users/:userId/articles/:articleId', async (req, res, next) => {

    try {

        await req.db.Article.findByIdAndDelete(req.params.articleId)
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
