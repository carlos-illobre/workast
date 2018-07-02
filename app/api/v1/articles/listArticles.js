const { Router } = require('express')
const halson = require('halson')
const _ = require('lodash')

module.exports = Router({mergeParams: true})
.get('/v1/articles', async (req, res, next) => {
         
    try {

        const articles = await req.db.Article.find(req.query.tags && {
            tags: {
                $in: _.flattenDeep([req.query.tags]),
            },
        })
        
        res.json({
            items: articles.map(
                ({ id, title, text, tags, userId }) => halson({
                    title,
                    text,
                    tags,
                })
                .addLink('self', `${req.base}/api/v1/users/${userId}/articles/${id}`)
                .addLink('author', `${req.base}/api/v1/users/${userId}`)
            ),
        })
        
    } catch(error) {
        next(error)
    }

})
