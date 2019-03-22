import AWS = require("aws-sdk");

export const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: process.env.DYNAMODB_URL,
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});
