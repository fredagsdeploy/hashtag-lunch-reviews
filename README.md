# Frontend [![CircleCI](https://circleci.com/gh/fredagsdeploy/hashtag-lunch-reviews.svg?style=svg)](https://circleci.com/gh/fredagsdeploy/hashtag-lunch-reviews)

Built in react with typescript and hooks!

Look into [serverless-api/README.md](serverless-api/README.md) for running the api gateway locally.

Look into [serverless-api/dynamodb-serverless/README.md](serverless-api/dynamodb-serverless/README.md) to run dynamodb locally. (Required by the api gateway)

## Development

```shell
yarn
REACT_APP_GOOGLE_API_KEY="" REACT_APP_CLIENT_ID="" yarn start # Find the keys in the google dev console
```

## Deploy to aws bucket

```shell
yarn
yarn build
aws s3 sync build s3://<bucket>
```
