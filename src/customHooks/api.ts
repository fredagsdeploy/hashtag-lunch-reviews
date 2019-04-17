import { getRatingsUrl, getReviewsByPlaceIdUrl } from "../lib/backend";
import { useFetch } from "./useFetch";

export const useReviewsByPlaceId = (placeId: string) =>
  useFetch(getReviewsByPlaceIdUrl(placeId));

export const useRatings = () => useFetch(getRatingsUrl());
