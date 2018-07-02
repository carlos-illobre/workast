<<<<<<< HEAD
init project
setup mocha
setup instanbul
Create server
setup express
setup swagger
setup logger
setup docker
setup mongodb
setup docker-compose
Create a new user endpoint: test, swagger, endpoint

Authentication
This API will be private, used by a mobile app or server side applications so every call to the API will include an API token (example: 5CD4ED173E1C95FE763B753A297D5) to validate. 
Please indicate in the API documentation where in the request we should place that token. Note: for simplicity make the token an environment variable

User Model:
_id
name (String)
avatar (Url)

Create a new article endpoint: test, swagger, endpoint

Article Model
_id
userId (User._id)
title (string)
text (string)
tags (array of strings)

Edit an article endpoint: test, swagger, endpoint

Delete an article endpoint: test, swagger, endpoint

Return all articles (from all users) that contains the given tag(s) (1 or more) endpoint: test, swagger, endpoint
=======
# Install
>>>>>>> develop

1. Install [docker](https://www.docker.com/community-edition#/download)
2. Install [docker-compose](https://docs.docker.com/compose/install/)
3. Install [nodeJs](https://nodejs.org/en/download/)
4. Clone the project: `https://github.com/carlos-illobre/workast.git`
5. Run: `npm run dev:build`
6. Open a browser and go to: `http://localhost:8080/api/doc`

The first time you run the test it will throw a timeout error because mockgoose will need to download something. Once mockgoose finish the download the test will run without errors.

# Commands

### npm test
Runs all the unit test using the in memory database

### npm run test:debug
Runs all the unit test in debug mode using the in memory database

### npm run test:nolint
Runs all the unit test using the test memory database without the linter check

### npm run dev:build
Build or rebuild all the docker containers and executes the node container in development mode.
It executes a [nodemon](https://github.com/remy/nodemon) instance to detect any change in the source code without the need of restart the container.

### npm run dev
Executes the node docker container in development mode without build it.
It executes a [nodemon](https://github.com/remy/nodemon) instance to detect any change in the source code without the need of restart the container.

### npm run dev:debug
Executes the node docker container in debug mode.

### npm run dev:shell
Opens a shell to the node container.

### npm run mongo:start
Executes the mongodb server docker container.

### npm run mongo:cli
Open a command line interface to the mongodb database. You should execute this command after `npm run mongo:start` or `npm run dev`

# Authentication

To authenticate the endpoints you have to add the Authorization header:

```
curl -X GET "http://localhost:8080/api/v1/articles" -H "accept: application/json" -H "Authorization: Bearer 5CD4ED173E1C95FE763B753A297D5"
```

# How to create a new endpoint

To create a new endpoint you just need to create a new file into `workast/app/api` or in any subfolder.
If the file exports an express Router then the Router will be automatically injected into the express application:
```
// workast/app/api/v1/my/url/helloworld.js
const { Router } = require('express')

module.exports = Router({mergeParams: true})
.Router({mergeParams: true})
.get('/my/url', (req, res, next) => {
    res.send('Hello')
})  

```

Now just save it and if the server was started with `npm run dev` or `npm run dev:build` then the endpoint will be there: http://localhost:8080/api/my/url
(The urls of all the automatic injected Routers will always start with `/api`).
The folder structure should be like the url path, so if the endpoint is `GET /my/url/helloword` then the file should be in `workast/app/api/my/url/helloworld.js`,

* Every POST endpoint must responds a location header with the created resource, in this example will be `http://localhost:8080/divisions/1`.
* In case of error you have to use try/catch and send the error to `next(error)`
* You should never return the full instance, you should return a [HAL](http://stateless.co/hal_specification.html) object:

```
res.status(201).json(
    halson()
    .addLink('self', location)
    .addLink('createArticle', `${location}/articles`)
    .addLink('listArticles', `${req.base}/api/v1/articles`)
)
```

That code will produce this:

```
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/api/v1/users/1"
    },
    "createArticle": {
      "href": "http://localhost:8080/api/v1/users/1/articles"
    },
    "listArticles": {
      "href": "http://localhost:8080/api/v1/articles/1"
    },
  }
}
```

You can add more links if you need it.

# How to execute Queries from the endpoint

Every endpoint will have all the mongoose models injected into the `req.db` parameter, so if you want to acces to the Article model you can do this: `req.db.Article`

```
// workast/app/api/v1/users/id/articles/deleteArticle.js
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
```

# Logger

Every endpoint will have a logger injected into the `req.logger` parameter:

```
// workast/app/api/v1/my/url/helloworld.js
const { Router } = require('express')

module.exports = Router({mergeParams: true})
.Router({mergeParams: true})
.get('/my/url', (req, res, next) => {
    req.logger.info('hello')
    res.send('Hello')
})  
```

The logger is an instance of [Winston](https://github.com/winstonjs/winston) so you can use `info`, `error`, `warn` and all the winston supported methods.

# How to create a test

To create a test you just need to create a new file into `workast/app` or into `scheduler-api/models` or into any sub folder. The filename extension must be `.test.js`:

```
const request = require('supertest')
const _ = require('lodash')
const { expect } = require('chai')

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)

describe('POST api/v1/users', function () {

    beforeEach(async function() {
        await createTestApp(this)
    })

    it('return 201 if the user was created', async function() {
        
        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
        }

        const res = await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(201)
        
        expect(res.header.location).to.exist
        const id = res.header.location.split('/').pop()
        expect(res.header.location).to.equal(`${res.request.url}/${id}`)
        expect(res.body).to.deep.equal({
            _links: {
                self: {
                    href: res.header.location,
                },
                createArticle: {
                    href: `${res.header.location}/articles`,
                },
                listArticles: {
                    href: `${res.request.protocol}//${res.request.host}/api/v1/articles`,
                },
            },
        })

        const user = await this.db.User.findById(id)

        expect(_.pick(user, Object.keys(data))).to.deep.equal(data)

    })

})

```
then just run `npm test`.

The test file should be in the same folder as the file to be tested.
This method creates and destroy the data in a memory database in each test.
The `createTestApp` creates the in memory database sets the following properties into the `this` object:
* db: This is the same object than `req.db`. It has all the entities and is the database reference
* app: This is the express application

You can't use an arrow function like this `it('return 200 and the list of sports', async () => {` because each test shares the `this` reference.

If you want to see the executed queries and the log info just add a `true` parameter to the `createTestApp` function:

```
const request = require('supertest')
const _ = require('lodash')
const { expect } = require('chai')

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`)

describe('POST api/v1/users', function () {

    beforeEach(async function() {
        await createTestApp(this, true)
    })

    it('return 201 if the user was created', async function() {
        
        const data = {
            name: 'some user name',
            avatar: 'http://some_url',
        }

        const res = await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.apiToken}`)
        .send(data)
        .expect(201)
        
        expect(res.header.location).to.exist
        const id = res.header.location.split('/').pop()
        expect(res.header.location).to.equal(`${res.request.url}/${id}`)
        expect(res.body).to.deep.equal({
            _links: {
                self: {
                    href: res.header.location,
                },
                createArticle: {
                    href: `${res.header.location}/articles`,
                },
                listArticles: {
                    href: `${res.request.protocol}//${res.request.host}/api/v1/articles`,
                },
            },
        })

        const user = await this.db.User.findById(id)

        expect(_.pick(user, Object.keys(data))).to.deep.equal(data)

    })

})

```

# How to create the Swagger documentation:

Just create a file into the endpoint's folder with the extension `.swagger.yaml` like this:
```
 /v1/users:
    post:
        tags: 
            - users
        summary: Creates a user
        description: Creates a user 
        operationId: createUser.js
        consumes:
            - application/json
            - application/x-www-form-urlencoded
        produces:
            - application/json
        parameters:
        -   name: Authorization
            in: header
            description: Authorization token
            required: true
            type: string
            example: Bearer 5CD4ED173E1C95FE763B753A297D5
        -   name: body
            in: body
            required: true
            schema:
                type: object
                required:
                    - name
                properties:
                    name:
                        type: string
                        example: Carlos
                    avatar:
                        type: string
                        example: http://my_avatar
                        format: uri
        responses:
            201:
                description: Created
                headers:
                    Location:
                        description: http://localhost:8080/api/v1/users/1
                        type: string
                        format: uri
                schema:
                    type: object
                    required:
                        - _links
                    properties:
                        _links:
                            type: object
                            required:
                                - self
                            properties:
                                self:
                                    type: object
                                    required:
                                        - href
                                    properties:
                                        href:
                                            type: string
                                            format: uri
                                            example: http://localhost:8080/api/v1/users/1
                                createArticle:
                                    type: object
                                    required:
                                        - href
                                    properties:
                                        href:
                                            type: string
                                            format: uri
                                            example: http://localhost:8080/api/v1/users/1/articles
                                listArticles:
                                    type: object
                                    required:
                                        - href
                                    properties:
                                        href:
                                            type: string
                                            format: uri
                                            example: http://localhost:8080/api/v1/articles
            400:
                description: Bad Request
            401:
                description: Unauthorized
            500:
                description: Internal server error
```
You should put an example value to each property.
The file must use the Swagger 2.0 format.


# Error handling

To handle the errors inside the endpoint just create an object { message: '', status: '' } with the message and the status code:

```
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
```

If the error does not have a `status` then it will be a 500 error.

# Data validation

When you want to validate the endpoint request we use [Express Validation](https://github.com/AndrewKeig/express-validation) as middleware:

```
const { Router } = require('express')
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
}), async (req, res, next) => { ... }
      
```
The schema uses [Joi](https://github.com/hapijs/joi) as framework:
