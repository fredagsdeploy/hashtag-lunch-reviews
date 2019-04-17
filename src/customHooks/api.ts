import {
  getRatingsUrl,
  getReviewsByPlaceIdUrl,
  getPlaceByPlaceIdUrl
} from "../lib/backend";
import { Review, Place } from "../types";
import { useFetch } from "./useFetch";

export const useReviewsByPlaceId = (placeId: string): Review[] =>
  useFetch(getReviewsByPlaceIdUrl(placeId));

export const useRatings = () => useFetch(getRatingsUrl());

export const usePlaceById = (placeId: string): Place =>
  useFetch(getPlaceByPlaceIdUrl(placeId));
