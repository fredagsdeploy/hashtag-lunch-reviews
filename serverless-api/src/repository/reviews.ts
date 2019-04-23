import { getPlaceById } from "./places";
import { dynamodb } from "./documentClient";

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
  const params = {
    TableName: "Reviews"
  };

  const response = await dynamodb.scan(params).promise();

  return (response.Items || []) as Review[];
};

export const getReviewsByPlaceId = async (
  placeId: string
): Promise<Review[]> => {
  const queryParams = {
    TableName: "Reviews",
    Select: "ALL_ATTRIBUTES",
    IndexName: "reviewPlaceIdIndex",
    KeyConditionExpression: "placeId = :place_id",
    ExpressionAttributeValues: { ":place_id": placeId }
  };
  const res = await dynamodb.query(queryParams).promise();
  console.log("query res", res);
  if (!res.Items || !res.Items[0]) {
    return [];
  }

  return res.Items as Review[];
};

export const saveReview = async (reviewInput: Review): Promise<Review> => {
  const params = {
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
