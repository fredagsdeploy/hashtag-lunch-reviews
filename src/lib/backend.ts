import { NewReview, Place, Rating, Review, ReviewRating, User } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_URL;

let token: string = "unset";

export const setToken = (newToken: string) => {
  token = newToken;
};

const handleResponse = async (r: Response): Promise<any> => {
  const j = await r.json();
  if (r.ok) {
    return j;
  }
  throw j;
};

export const myFetch = (
  url: RequestInfo,
  requestOptions: RequestInit | undefined = {}
) =>
  fetch(url, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      Authorization: token
    }
  });

export const getReviewsByPlaceIdUrl = (placeId: string): string =>
  `${BASE_URL}/places/${placeId}/reviews`;

export const getRatingsUrl = () => BASE_URL + "/ratings";

export const getUserByUserIdUrl = (googleUserId: string) =>
  `${BASE_URL}/users/${googleUserId}`;

export const getPlaceByPlaceIdUrl = (placeId: string) =>
  `${BASE_URL}/places/${placeId}`;

export const getReviewsForPlace = (placeId: string): Promise<Review[]> => {
  return myFetch(getReviewsByPlaceIdUrl(placeId)).then(handleResponse);
};

export const getRatings = (): Promise<Rating[]> => {
  return myFetch(getRatingsUrl()).then(handleResponse);
};

export const getUser = (googleUserId: string): Promise<User> => {
  return myFetch(getUserByUserIdUrl(googleUserId)).then(handleResponse);
};

export const putUser = (
  user: Partial<User> & Pick<User, "googleUserId">
): Promise<User> => {
  return myFetch(getUserByUserIdUrl(user.googleUserId), {
    method: "put",
    body: JSON.stringify(user)
  }).then(handleResponse);
};

export const getPlaceById = (placeId: string): Promise<Place> => {
  return myFetch(getPlaceByPlaceIdUrl(placeId)).then(handleResponse);
};

export const postPlace = (place: Partial<Place>): Promise<Rating> => {
  const { placeName } = place;
  if (!placeName) {
    throw new Error(
      `Missing attribute(s) in place ${JSON.stringify(placeName)}`
    );
  }
  return myFetch(BASE_URL + "/places", {
    method: "post",
    body: JSON.stringify(place)
  }).then(handleResponse);
};

export const postReview = (review: NewReview): Promise<ReviewRating> => {
  const { userId, placeId, rating } = review;
  if (!userId || !placeId || !rating) {
    throw new Error(`Missing attribute(s) in review ${JSON.stringify(review)}`);
  }
  return myFetch(BASE_URL + "/reviews", {
    method: "post",
    body: JSON.stringify(review)
  }).then(handleResponse);
};
