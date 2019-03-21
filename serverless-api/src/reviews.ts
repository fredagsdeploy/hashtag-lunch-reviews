import { v1 as uuid } from "uuid";
import { createResponse, LambdaHandler } from "./common";
import { getAllReviews, saveReview, Review } from "./repository/reviews";

export const getReviews: LambdaHandler = async event => {
  const reviews = await getAllReviews();

  return createResponse(200, { reviews });
};

const parseJSON = (input: string | null) => JSON.parse(input || "");

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
