import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse } from "./common";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

type LambdaHandler = (
  event: APIGatewayEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

export const getReviews: LambdaHandler = async event => {
  var params = {
    TableName: "Reviews"
  };

  const response = await dynamodb.scan(params).promise();

  return createResponse(200, { reviews: response });
};

const parseJSON = (input: string | null) => JSON.parse(input || "");

interface ReviewInput {
  reviewId: string;
  name: string;
  placeId: string;
  rating: number;
  comment: string;
}

interface Review {
  reviewId: string;
  userId: string;
  placeId: string;
  rating: number;
  comment: string;
}

const createReview = (
  reviewId: string,
  userId: string,
  placeId: string,
  rating: number,
  comment: string
): Review => ({
  reviewId,
  userId,
  placeId,
  rating,
  comment
});

export const postReviews: LambdaHandler = async event => {
  const body = parseJSON(event.body) as Partial<ReviewInput>;

  const { name, placeId, rating, comment } = body;

  if (!name || !placeId || !rating || !comment) {
    return createResponse(400, { error: "Missing paramters" });
  }

  const newUUID = uuid();
  var params = {
    TableName: "Reviews",
    Item: createReview(newUUID, name, placeId, rating, comment)
  };

  await dynamodb.put(params).promise();

  const getParams = {
    TableName: "Reviews",
    Key: {
      reviewId: newUUID
    }
  };

  const response = await dynamodb.get(getParams).promise();

  return createResponse(201, { newPlace: response.Item });
};
