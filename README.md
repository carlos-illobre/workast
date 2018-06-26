# Install

1. Install [docker](https://www.docker.com/community-edition#/download)
2. Install [docker-compose](https://docs.docker.com/compose/install/)
3. Install [nodeJs](https://nodejs.org/en/download/)
4. Clone the project: `git clone git@gitlab.bluestarsports.io:tournamentconnect/scheduler-api.git`
5. Run: `npm run dev:build`
6. Open a browser and go to: `http://localhost:8080/api/doc`

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

# How to create a new endpoint

To create a new endpoint you just need to create a new file into `workast/app/api` or in any subfolder.
If the file exports an express Router then the Router will be automatically injected into the express application:
```
// workast/app/api/v1/my/url/helloworld.js
const express = require('express')

module.exports = express
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
    halson({
        id: division.id
    }).addLink('self', location)    
);
```

That code will produce this:

```
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/divisions/1"
    }
  }
}
```

You can add more links if you need it.

# How to execute Queries from the endpoint

Every endpoint will have all the mongoose models injected into the `req.db` parameter, so we can do this:

```
// workast/app/api/v1/sports/getSports.js
const express = require('express');
    
module.exports = express       
.Router({mergeParams: true})   
.get('/v1/sports', async (req, res, next) => {
  
    const sports = await req.db.Sport.findAll({
        raw: true,
    });
    res.send({ sports });

});  
```
You should never return the entity, you must return the raw data.

# Logger

Every endpoint will have a logger injected into the `req.logger` parameter:

```
// workast/app/api/v1/sports/getSports.js
const express = require('express');
    
module.exports = express       
.Router({mergeParams: true})   
.get('/v1/sports', async (req, res, next) => {

    req.logger.info('hello');
    const sports = await req.db.Sport.findAll({
        raw: true
    });
    res.send({ sports });

});  
```

The logger is an instance of [Winston](https://github.com/winstonjs/winston) so you can use `info`, `error`, `warn` and all the winston supported methods.

# How to create a test

To create a test you just need to create a new file into `workast/app` or into `scheduler-api/models` or into any sub folder. The filename extension must be `.test.js`:

```
const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/sports', function () {
  
    beforeEach(function() {    
        return createTestApp(this);     
    }); 
      
    it('return 200 and the list of sports', async function() {
      
        const sports = await this.db.Sport.findAll();
        
        request(this.app)
        .get('/api/v1/sports')          
        .expect(200, {
            sports: sports.map((sport) => {
                return {   
                    id: sport.id,                   
                    name: sport.name,               
                };

            })
        });

    });

})
```
then just run `npm test`.

The test file should be in the same folder as the file to be tested.
This method creates and destroy the in memory database in each test.
The `createTestApp` creates the in memory database sets the following properties into the `this` object:
* db: It is the same object than `req.db`. It has all the entities and is the database reference
* app: It is the express application

You can't use an arrow function like this `it('return 200 and the list of sports', async () => {` because each test shares the `this` reference.

If you want to see the executed queries and the log info just add a `true` parameter to the `createTestApp` function:

```
const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/sports', function () {
  
    beforeEach(function() {    
        return createTestApp(this, true);     
    }); 
      
    it('return 200 and the list of sports', async function() {
      
        const sports = await this.db.Sport.findAll();
        
        request(this.app)
        .get('/api/v1/sports')          
        .expect(200, {
            sports: sports.map((sport) => {
                return {   
                    id: sport.id,                   
                    name: sport.name,               
                };

            })
        });

    });

})
```

# How to create the Swagger documentation:

Just create a file into the endpoint's folder with the extension `.swagger.yaml` like this:
```
/v1/sports:
    get:
        tags:                  
            - sports           
        summary: Get all the sports     
        description: Get all the sports. This is a public endpoint.
        operationId: getSports.js       
        produces:
            - application/json 
        responses:             
            200:
                description: OK
                schema:        
                    type: object                    
                    required:  
                        - sports                        
                    properties:
                        sports:
                            type: array                     
                            items:                          
                                type: object                    
                                required:                       
                                    - id                            
                                    - name                          
                                properties:                     
                                    id:                             
                                        type: number                    
                                        example: 1                      
                                    name:                           
                                        type: string                    
                                        example: Soccer                 
            500:               
                description: Internal server error
```
You should put an example value to each property.
The file must use the Swagger 2.0 format.

## Operator Authentication

To authenticate an endpoint you have to add the `scheduler-api/app/auth/operatorAuthMiddleware.js`, this middleware uses the jwt to search the user into the database and verifies the user has role operator ar role admin. If the user does not exists or is not operator neither admin then returns a 401 error, if the user exists and has operator or admin role then the user instance will be stored into `req.user`:

```
const express = require('express');
const operatorAuth = require(`${process.env.PWD}/app/auth/operatorAuthMiddleware.js`);
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.post('/v1/divisions', operatorAuth, async (req, res, next) => {

    try {
    
        req.logger.info(`The user id is: ${req.user.id}`);
        req.logger.info(`The operator id is: ${req.user.operator.id}`);

        const division = await req.db.Division.create({
            name: req.body.name,
            gender_id: req.body.gender_id,
            abbreviation: req.body.abbreviation,
            skill: req.body.skill,
        });

        const location = `${req.base}${req.originalUrl}/${division.id}`;
        res.setHeader('Location', location);
        res.status(201).json(
            halson({
                id: division.id
            }).addLink('self', location)
        );

    } catch(error) {
        next(error);
    }

});
```

## Test with Swagger
To make the endpoint testable from swagger you have to add the header parameter:
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
            example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk
        -   name: body
            in: body
            required: true
            schema:
                type: object   
                properties:
                    first_name:
                        type: string                    
                        example: Greg                   
                    last_name: 
                        type: string                    
                        example: Williams  
                    email:     
                        type: string                    
                        example: gwilliams@bluestarspots.com
                        format: email                   
                    phone:     
                        type: string   
                        example: 555-5555
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
                                - id
                                - self
                            properties:
                                id:
                                    type: number
                                    example: 1
                                self:
                                    type: object
                                    required:
                                        - href
                                    properties:
                                        href:
                                            type: string
                                            format: uri
                                            example: http://localhost:8080/users/1
            400:
                description: Bad Request
            500:
                description: Internal server error
```




setup-docker
============
setup docker
setup mongodb
setup docker-compose


create-user
===========
Create a new user endpoint: test, swagger, endpoint

Authentication
This API will be private, used by a mobile app or server side applications so every call to the API will include an API token (example: 5CD4ED173E1C95FE763B753A297D5) to validate. 
Please indicate in the API documentation where in the request we should place that token. Note: for simplicity make the token an environment variable

User Model:
_id
name (String)
avatar (Url)


create-article
==============
Create a new article endpoint: test, swagger, endpoint

Article Model
_id
userId (User._id)
title (string)
text (string)
tags (array of strings)


edit-article
============
Edit an article endpoint: test, swagger, endpoint


delete-article
==============
Delete an article endpoint: test, swagger, endpoint


list-articles
=============
Return all articles (from all users) that contains the given tag(s) (1 or more) endpoint: test, swagger, endpoint

