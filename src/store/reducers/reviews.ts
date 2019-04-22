import { Reducer } from "redux";
import { Review } from "../../types";
import { StoreState } from "../configureStore";
import { PlaceId, Resolved } from "./ratings";

export type ReviewState = Resolved<Review[]>;

const initialReviewState: ReviewState = {
  resolved: false,
  data: null
};

export type ReviewsState = Record<PlaceId, ReviewState>;

const initialReviewsState: ReviewsState = {};

export const reviewsReducer: Reducer<
  ReviewsState,
  SetReviewsAction | AddReviewAction
> = (state = initialReviewsState, action) => {
  switch (action.type) {
    case "SET_REVIEWS":
      return {
        ...state,
        [action.placeId]: {
          resolved: true,
          data: action.reviews
        }
      };
    case "ADD_REVIEW": {
      const reviewState = state[action.placeId];

      if (reviewState && reviewState.resolved) {
        return {
          ...state,
          [action.placeId]: {
            ...reviewState,
            data: [...reviewState.data, action.review]
          }
        };
      } else {
        return {
          ...state,
          [action.placeId]: {
            resolved: true,
            data: [action.review]
          }
        };
      }
    }
    default:
      return state;
  }
};

export const getReviewsState = (
  state: StoreState,
  placeId: PlaceId
): ReviewState => state.reviews[placeId] || initialReviewState;

interface SetReviewsAction {
  type: "SET_REVIEWS";
  placeId: PlaceId;
  reviews: Review[];
}

export const setReviews = (
  placeId: PlaceId,
  reviews: Review[]
): SetReviewsAction => ({
  placeId,
  reviews,
  type: "SET_REVIEWS"
});

interface AddReviewAction {
  type: "ADD_REVIEW";
  placeId: PlaceId;
  review: Review;
}

export const addReview = (
  placeId: PlaceId,
  review: Review
): AddReviewAction => ({
  placeId,
  review,
  type: "ADD_REVIEW"
});
