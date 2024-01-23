## pdexanalytics-graphql

## Installation

`npm install`

## To start the application

`npm run dev`

Required Environment Variables:

* MYSQL_DB_HOST
* MYSQL_DB_USER
* MYSQL_DB_PASSWORD
* MYSQL_DB
* MYSQL_DB_PROXY
* NOT_LAMBDA (true for local testing, false on AWS)

## Deployment

Use github actions to push to AWS Lambda/S3

Lambda handler: src/lambda.js