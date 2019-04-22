import { useCallback, useMemo, useRef } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import {
  getPlaceByPlaceIdUrl,
  getRatings,
  getReviewsForPlace
} from "../lib/backend";
import { StoreState } from "../store/configureStore";
import { PlaceId, RatingsState, setRatings } from "../store/reducers/ratings";
import {
  getReviewsState,
  ReviewState,
  setReviews
} from "../store/reducers/reviews";
import { Place, Rating, Review } from "../types";
import { useFetch } from "./useFetch";

export const usePlaceById = (placeId: string): Place =>
  useFetch(getPlaceByPlaceIdUrl(placeId));

const mapRatingsState = (state: StoreState): RatingsState => state.ratings;

export const useRatings = (): Rating[] => {
  const ratingsPromise = useRef<Promise<Rating[]> | null>(null);
  const state = useMappedState(mapRatingsState);
  const dispatch = useDispatch();

  const ratings = useMemo<Rating[]>(
    () => (state.resolved ? Object.values(state.data) : []),
    [state.data]
  );

  if (state.resolved) {
    return ratings;
  }

  if (!ratingsPromise.current) {
    ratingsPromise.current = getRatings().then(ratings => {
      dispatch(setRatings(ratings));
      return ratings;
    });
  }

  if (!state.resolved) {
    throw ratingsPromise.current;
  }

  return ratings;
};

export const useReviewsByPlaceId = (placeId: PlaceId): Review[] => {
  const reviewsPromise = useRef<Promise<Review[]> | null>(null);
  const lastPlaceId = useRef<PlaceId>(placeId);

  const mapState = useCallback<(state: StoreState) => ReviewState>(
    state => getReviewsState(state, placeId),
    [placeId]
  );

  const state = useMappedState(mapState);
  const dispatch = useDispatch();


  if (state.resolved && placeId === lastPlaceId.current) {
    return state.data;
  }

  if (!reviewsPromise.current || placeId !== lastPlaceId.current) {
    reviewsPromise.current = getReviewsForPlace(placeId).then(reviews => {
      dispatch(setReviews(placeId, reviews));

      return reviews;
    });
  }

  if (!state.resolved) {
    throw reviewsPromise.current;
  }

  return state.data;
};
