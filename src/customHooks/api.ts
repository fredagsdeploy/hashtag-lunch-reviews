import { getRatingsUrl, getReviewsByPlaceIdUrl } from "../lib/backend";
import { Review } from "../types";
import { useFetch } from "./useFetch";

export const useReviewsByPlaceId = (placeId: string): Review[] =>
  useFetch(getReviewsByPlaceIdUrl(placeId));

export const useRatings = () => useFetch(getRatingsUrl());
