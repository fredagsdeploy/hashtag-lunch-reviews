import { Reducer } from "redux";
import { Rating } from "../../types";

export type PlaceId = string;

export type Resolved<TData> =
  | {
      resolved: true;
      data: TData;
    }
  | {
      resolved: false;
      data: null;
    };

export type RatingsState = Resolved<Record<PlaceId, Rating>>;

const initialRatingsState: RatingsState = {
  resolved: false,
  data: null
};

export const ratingsReducer: Reducer<
  RatingsState,
  SetRatingsAction | UpdateRatingAction
> = (state = initialRatingsState, action) => {
  switch (action.type) {
    case "SET_RATINGS":
      return {
        resolved: true,
        data: action.ratings.reduce(
          (acc, rating) => ({
            ...acc,
            [rating.placeId]: rating
          }),
          state.data || {}
        )
      };
    case "UPDATE_RATING":
      if (state.resolved) {
        return {
          ...state,
          data: {
            ...state.data,
            [action.rating.placeId]: action.rating
          }
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

interface SetRatingsAction {
  type: "SET_RATINGS";
  ratings: Rating[];
}

export const setRatings = (ratings: Rating[]): SetRatingsAction => ({
  type: "SET_RATINGS",
  ratings
});

interface UpdateRatingAction {
  type: "UPDATE_RATING";
  rating: Rating;
}

export const updateRating = (rating: Rating): UpdateRatingAction => ({
  type: "UPDATE_RATING",
  rating
});
