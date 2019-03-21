import uuid = require("uuid");
import * as AWS from "aws-sdk";
import { createResponse } from "./common";

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export const postUser = async (event, context) => {
  const newUUID = uuid();
  const googleId = event.queryStringParameters.googleId;
  console.log("google_id", googleId);

  const userFromGoogleId = await getUserByGoogleId(googleId);
  if (userFromGoogleId) {
    return createResponse(400, {
      error: "A user with that googleId already exists"
    });
  }

  var params = {
    TableName: "Users",
    Item: {
      userId: newUUID,
      googleId
    }
  };

  await dynamodb.put(params).promise();

  const getParams = {
    TableName: "Users",
    Key: {
      userId: newUUID
    }
  };

  const response = await dynamodb.get(getParams).promise();

  return createResponse(201, { user: response.Item });
};

const getUserByGoogleId = async (googleId: string): Promise<any> => {
  const queryParams = {
    TableName: "Users",
    IndexName: "googleIdIndex",
    KeyConditionExpression: "googleId = :google_id",
    ExpressionAttributeValues: { ":google_id": googleId }
  };
  const res = await dynamodb.query(queryParams).promise();

  if (!res.Items || res.Items.length == 0) {
    return undefined;
  }

  return res.Items[0];
};
