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

