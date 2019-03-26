import { v1 as uuid } from "uuid";
import { createResponse, LambdaHandler, parseJSON } from "./common";
import {getAllReviews, saveReview, Review, getReviewsByPlaceId} from "./repository/reviews";

export const getReviews: LambdaHandler = async event => {
  const reviews = await getAllReviews();

  return createResponse(200, { reviews });
};

export const getReviewsByPlace: LambdaHandler = async event => {
  if(! event.pathParameters || !event.pathParameters.placeId) {
    return createResponse(400, {message: "Missing path parameter"})
  }
  const reviews = await getReviewsByPlaceId(event.pathParameters.placeId)
  return createResponse(200, reviews);
}

const createReview = (
  reviewId: string,
  userId: string,
  placeId: string,
  rating: string,
  comment: string
): Review => ({
  reviewId,
  userId,
  placeId,
  rating: parseFloat(rating),
  comment
});

export interface ReviewInput {
  reviewId: string;
  name: string;
  placeId: string;
  rating: string;
  comment: string;
}

export const postReviews: LambdaHandler = async event => {
  const body = parseJSON(event.body) as Partial<ReviewInput>;

  const { name, placeId, rating, comment } = body;

  if (!name || !placeId || !rating || !comment) {
    return createResponse(400, { error: "Missing parameters" });
  }

  const newUUID = uuid();

  try {
    const review = await saveReview(
      createReview(newUUID, name, placeId, rating, comment)
    );
    return createResponse(201, { review });
  } catch (error) {
    return createResponse(400, { error: error.message });
  }
};
