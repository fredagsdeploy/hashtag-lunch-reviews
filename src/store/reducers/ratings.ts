import { Reducer } from "redux";
import { Rating } from "../../types";

export type PlaceId = string;

export type RatingsState = Record<PlaceId, Rating>;

const initialRatingsState: RatingsState = {};

export const ratingsReducer: Reducer<RatingsState> = (
  state = initialRatingsState,
  action
) => {
  return state;
};
