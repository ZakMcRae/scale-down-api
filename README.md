# scale-down-api
Back end API for a calorie counting app w/ interactive docs.
Not currently deployed anywhere. Front end does not exist yet and is on pause as I am starting work professionally.

## Description
This API uses a mongoDB database to store user, food and meal data. There are endpoints for CRUD purposes on the user, food and meal data.
There are endpoints to deal with user login/auth using bcrpyt to hash passwords and JWT to generate authorization tokens.
I built some utilities to store users most recently used foods and calculate nutrition infos depending on dates specified.

![](https://i.imgur.com/XZwLQqV.png)

## Learned on project
- working in a node.js project on an API
- Express back end framework
  - wrote custom middleware to check for auth header and decode userid from auth header token
- using a noSQL database (mongoDB)
- using mongoose ODM for mongoDB
- using swagger-jsdoc and swagger-ui-express
  - swagger-ui provides interactive documentation to your project
  - swagger-jsdoc allowed me to write docs inline with endpoints and still be used for swagger-ui docs

## Tech
- Javascript (nodeJS)
- Express
- mongoDB with mongoose ODM
- swagger-jsdoc and swagger-ui-express
