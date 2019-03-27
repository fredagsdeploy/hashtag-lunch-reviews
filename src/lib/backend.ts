import { Review, Place, Rating } from "../types";

const BASE_URL = "http://localhost:4000";

const myFetch = (
  url: RequestInfo,
  requestOptions?: RequestInit | undefined
) => {
  return fetch(url, requestOptions).then(async (r: Response) => {
    const j = await r.json();
    if (r.ok) {
      return j;
    }
    throw j;
  });
};

export const getReviewsForPlace = (placeId: string): Promise<Review[]> => {
  return myFetch(`${BASE_URL}/reviews/${placeId}`);
};

export const getRatings = (): Promise<Rating[]> => {
  return myFetch(BASE_URL + "/ratings");
};

export const getPlaceById = (placeId: string): Promise<Place> => {
  return myFetch(`${BASE_URL}/places/${placeId}`);
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

export const postReview = (
  review: Partial<Review>
): Promise<{ review: Review }> => {
  const { userId, placeId, rating, comment } = review;
  if (!userId || !placeId || !rating || !comment) {
    throw new Error(`Missing attribute(s) in review ${JSON.stringify(review)}`);
  }
  return myFetch(BASE_URL + "/reviews", {
    method: "post",
    body: JSON.stringify(review)
  });
};
