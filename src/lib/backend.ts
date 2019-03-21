import { Review, Place, Rating } from "../types";

const BASE_URL = "http://localhost:4000";

export const getReviewsForPlace = (placeId: string): Promise<Review[]> => {
  return fetch(BASE_URL + "/reviews").then(r => r.json());
};

export const getRatings = (): Promise<Rating[]> => {
  return fetch(BASE_URL + "/ratings").then(r => r.json());
};

export const postPlace = (place: Place): Promise<Review[]> => {
  return fetch(BASE_URL + "/reviews", {
    method: "post",
    body: JSON.stringify({})
  }).then(r => r.json());
};
