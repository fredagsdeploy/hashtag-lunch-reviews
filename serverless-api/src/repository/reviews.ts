import * as AWS from "aws-sdk";
import { getPlaceById } from "./places";

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export interface Review {
  reviewId: string;
  userId: string;
  placeId: string;
  rating: number;
  comment: string;
}

export const getReviewById = async (
  reviewId: string
): Promise<Review | undefined> => {
  const getParams = {
    TableName: "Reviews",
    Key: {
      reviewId
    }
  };

  const review = await dynamodb.get(getParams).promise();

  return review.Item as Review | undefined;
};

export const getAllReviews = async (): Promise<Review[]> => {
  var params = {
    TableName: "Reviews"
  };

  const response = await dynamodb.scan(params).promise();

  return (response.Items || []) as Review[];
};

export const saveReview = async (reviewInput: Review): Promise<Review> => {
  var params = {
    TableName: "Reviews",
    Item: reviewInput
  };

  const place = await getPlaceById(reviewInput.placeId);
  if (!place) {
    throw new Error(`There's no place like ${reviewInput.placeId}`);
  }

  await dynamodb.put(params).promise();

  const review = await getReviewById(reviewInput.reviewId);

  return review!;
};
