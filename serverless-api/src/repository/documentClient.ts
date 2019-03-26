import AWS = require("aws-sdk");

export let dynamodb: AWS.DynamoDB.DocumentClient;
if (process.env.STAGE_ENV === "dev") {
  dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000"
  });
} else if (process.env.STAGE_ENV === "prod") {
  AWS.config.update({ region: "eu-north-1" });

  dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10"
  });
} else {
  throw new Error("Invalid STAGE_ENV");
}
