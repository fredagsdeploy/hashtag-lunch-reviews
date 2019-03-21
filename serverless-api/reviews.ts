import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse } from "./common";

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export const getReviews = async (event, context) => {
  var params = {
    TableName: "Reviews"
  };

  const response = await dynamodb.scan(params).promise();

  return createResponse(200, { reviews: response });
};

export const postReviews = async (event, context) => {
  const newUUID = uuid();
  var params = {
    TableName: "Reviews",
    Item: {
      review_id: newUUID,
      user_id: event.queryStringParameters.name, // TODO, do select before to check for existance
      place_id: event.queryStringParameters.place_id, // TODO. do select before to check for existance
      rating: event.queryStringParameters.rating,
      comment: event.queryStringParameters.comment
    }
  };

  await dynamodb.put(params).promise();

  const getParams = {
    TableName: "Reviews",
    Key: {
      review_id: newUUID
    }
  };

  const response = await dynamodb.get(getParams).promise();

  return createResponse(201, { newPlace: response.Item });
};
