import { v1 as uuid } from "uuid";
import { createResponse, LambdaHandler, parseJSON } from "./common";
import {
  getAllReviews,
  saveReview,
  Review,
  getReviewsByPlaceId
} from "./repository/reviews";
import { getUserById, User } from "./repository/users";

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
  userId: string;
  placeId: string;
  rating: string;
  comment: string;
}

export interface ReviewOutput {
  reviewId: string;
  user: User;
  placeId: string;
  rating: number;
  comment: string;
}

const expandReview = async ({
  userId,
  ...rest
}: Review): Promise<ReviewOutput> => {
  const user = (await getUserById(userId))!;

  return {
    ...rest,
    user
  };
};

const expandReviews = async (reviews: Review[]): Promise<ReviewOutput[]> => {
  return Promise.all(reviews.map(expandReview));
};

export const getReviews: LambdaHandler = async event => {
  const reviews = await getAllReviews();

  const extendedReviews = await expandReviews(reviews);

  return createResponse(200, extendedReviews);
};

export const getReviewsByPlace: LambdaHandler = async event => {
  console.log(`Get reviews by place ${JSON.stringify(event)}`);

  if (!event.pathParameters || !event.pathParameters.placeId) {
    return createResponse(400, { message: "Missing path parameter" });
  }
  const reviews = await getReviewsByPlaceId(event.pathParameters.placeId);
  const extendedReviews = await expandReviews(reviews);
  return createResponse(200, extendedReviews);
};

export const postReviews: LambdaHandler = async event => {
  const body = parseJSON(event.body) as Partial<ReviewInput>;

  const { userId, placeId, rating, comment } = body;

  if (!userId || !placeId || !rating) {
    return createResponse(400, { error: "Missing parameters" });
  }

  const newUUID = uuid();

  try {
    const review = await saveReview(
      createReview(newUUID, userId, placeId, rating, comment ? comment : " ")
    );
    const expandedReview = await expandReview(review);
    return createResponse(201, expandedReview);
  } catch (error) {
    return createResponse(400, { error: error.message });
  }
};
