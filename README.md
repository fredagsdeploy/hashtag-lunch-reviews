[![CircleCI](https://circleci.com/gh/Tejpbit/hashtag-lunch-reviews.svg?style=svg)](https://circleci.com/gh/Tejpbit/hashtag-lunch-reviews)

# Frontend
Built in react with typescript and hooks!

Look into [serverless-api/README.md](serverless-api/README.md) for running the api gateway locally.

Look into [serverless-api/dynamodb-serverless/README.md](serverless-api/dynamodb-serverless/README.md) to run dynamodb locally. (Required by the api gateway)


## Development
```shell
yarn
yarn start
```


## Deploy to aws bucket

```shell
yarn
yarn build
aws s3 sync build s3://<bucket>
```
