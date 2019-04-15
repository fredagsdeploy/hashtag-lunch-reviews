import { Review, Place, Rating, User, NewReview } from "../types";

const BASE_URL = "http://localhost:4000";

let token: string = "unset";

export const setToken = (newToken: string) => {
  token = newToken;
};

const myFetch = (
  url: RequestInfo,
  requestOptions: RequestInit | undefined = {}
) => {
  return fetch(url, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      Authorization: token
    }
  }).then(async (r: Response) => {
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

export const getUser = (googleUserId: string): Promise<User> => {
  return myFetch(`${BASE_URL}/users/${googleUserId}`);
};

export const putUser = (user: Partial<User>): Promise<User> => {
  return myFetch(`${BASE_URL}/users/${user.googleUserId}`, {
    method: "put",
    body: JSON.stringify(user)
  });
};

export const getPlaceById = (placeId: string): Promise<Place> => {
  return myFetch(`${BASE_URL}/places/${placeId}`);
};

export const postPlace = (place: Partial<Place>): Promise<Place> => {
  const { placeName } = place;
  if (!placeName) {
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
  review: NewReview
): Promise<Review> => {
  const { userId, placeId, rating, comment } = review;
  if (!userId || !placeId || !rating || !comment) {
    throw new Error(`Missing attribute(s) in review ${JSON.stringify(review)}`);
  }
  return myFetch(BASE_URL + "/reviews", {
    method: "post",
    body: JSON.stringify(review)
  });
};
