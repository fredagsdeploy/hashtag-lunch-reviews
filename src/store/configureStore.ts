import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ratingsReducer as ratings, RatingsState } from "./reducers/ratings";
import { reviewsReducer as reviews, ReviewsState } from "./reducers/reviews";
import { userReducer as user, UserState } from "./reducers/user";

export interface StoreState {
  user: UserState;
  ratings: RatingsState;
  reviews: ReviewsState;
}

const rootReducer = combineReducers<StoreState>({
  reviews,
  ratings,
  user
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
