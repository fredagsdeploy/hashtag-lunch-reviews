import { Reducer } from "redux";
import { Review } from "../../types";
import { PlaceId } from "./ratings";

export type ReviewsState = Record<PlaceId, Review[]>;

const initialReviewsState: ReviewsState = {};

export const reviewsReducer: Reducer<ReviewsState> = (
  state = initialReviewsState,
  action
) => {
  return state;
};
