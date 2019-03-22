import { Review, Place, Rating } from "../types";
import { reject } from "q";

const BASE_URL = "http://localhost:4000";

const myFetch = (url: RequestInfo, requestOptions: RequestInit | undefined) => {
  return fetch(url, requestOptions).then(async (r: Response) => {
    const j = await r.json();
    if (r.ok) {
      return j;
    }
    throw j;
  });
};

export const getReviewsForPlace = (placeId: string): Promise<Review[]> => {
  return fetch(BASE_URL + "/reviews").then(r => r.json());
};

export const getRatings = (): Promise<Rating[]> => {
  return fetch(BASE_URL + "/ratings").then(r => r.json());
};

export const postPlace = (place: Partial<Place>): Promise<Place> => {
  const { placeName, google_maps_link, comment } = place;
  if (!placeName || !google_maps_link || !comment) {
    throw new Error(
      `Missing attribute(s) in place ${JSON.stringify(placeName)}`
    );
  }
  return myFetch(BASE_URL + "/places", {
    method: "post",
    body: JSON.stringify(place)
  });
};
