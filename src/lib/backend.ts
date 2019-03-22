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
  return myFetch(BASE_URL + "/reviews");
};

export const getRatings = (): Promise<Rating[]> => {
  return myFetch(BASE_URL + "/ratings");
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
