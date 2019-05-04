import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRatingByPlaceIdUrl,
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
import { Rating, Review } from "../types";
import { useFetch } from "./useFetch";

type Suspender = {
  then(resolve: () => any, reject: () => any): any;
};

enum ResultStatus {
  Pending = 0,
  Resolved = 1,
  Rejected = 2
}

type PendingResult = {
  status: ResultStatus.Pending;
  value: Suspender;
};

type ResolvedResult = {
  status: ResultStatus.Resolved;
};

type RejectedResult = {
  status: ResultStatus.Rejected;
  value: unknown;
};

type Result = PendingResult | ResolvedResult | RejectedResult;

export const useRatingByPlaceId = (placeId: string): Rating =>
  useFetch(getRatingByPlaceIdUrl(placeId));

let ratingsResult: Result | null = null;

export const useRatings = (): Rating[] => {
  const state = useSelector<RatingsState, StoreState>(
    state => state.ratings,
    []
  );
  const dispatch = useDispatch();

  const ratings = useMemo<Rating[]>(
    () => (state.resolved ? Object.values(state.data) : []),
    [state.data, state.resolved]
  );

  if (state.resolved) {
    return ratings;
  }

  if (!ratingsResult) {
    const suspender = getRatings();

    ratingsResult = {
      status: ResultStatus.Pending,
      value: suspender
    };

    suspender
      .then(ratings => {
        dispatch(setRatings(ratings));

        ratingsResult = {
          status: ResultStatus.Resolved
        };
        return ratings;
      })
      .catch(error => {
        ratingsResult = {
          status: ResultStatus.Rejected,
          value: error
        };
      });
  }

  // noinspection JSUnreachableSwitchBranches
  switch (ratingsResult.status) {
    case ResultStatus.Pending: {
      const suspender = ratingsResult.value;
      throw suspender;
    }
    case ResultStatus.Rejected: {
      const error = ratingsResult.value;
      throw error;
    }
    default:
  }

  return ratings;
};

const reviewsByPlaceIdCache: Record<PlaceId, Result> = {};

export const useReviewsByPlaceId = (placeId: PlaceId): Review[] => {
  const state = useSelector<ReviewState, StoreState>(
    state => getReviewsState(state, placeId),
    [placeId]
  );
  const dispatch = useDispatch();

  if (state.resolved) {
    return state.data;
  }

  let result = reviewsByPlaceIdCache[placeId];

  if (!result) {
    const suspender = getReviewsForPlace(placeId);
    const newResult: PendingResult = {
      status: ResultStatus.Pending,
      value: suspender
    };

    suspender.then(
      reviews => {
        dispatch(setReviews(placeId, reviews));

        if (newResult.status === ResultStatus.Pending) {
          reviewsByPlaceIdCache[placeId] = {
            status: ResultStatus.Resolved
          };
        }

        return reviews;
      },
      error => {
        reviewsByPlaceIdCache[placeId] = {
          status: ResultStatus.Rejected,
          value: error
        };
      }
    );
    reviewsByPlaceIdCache[placeId] = newResult;
  }

  result = reviewsByPlaceIdCache[placeId];

  switch (result.status) {
    case ResultStatus.Pending: {
      const suspender = result.value;
      throw suspender;
    }
    case ResultStatus.Rejected: {
      const error = result.value;
      throw error;
    }
    default:
  }

  return state.data!;
};
