import { string } from "prop-types";

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface Rating extends Place {
  rating: number;
  normalized_rating: number;
  rank: number;
}
export interface Review {
  reviewId: string;
  userId: string;
  placeId: string;
  rating: number;
  comment: string;
}

export type NewReview = Omit<Review, "reviewId">;

export interface Place {
  placeId: string;
  placeName: string;
  googlePlaceId?: string;
  googlePlace?: any;
  google_maps_link: string;
  comment: string;
}

export interface GoogleUser {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  imageUrl: string;
  email: string;
}

export interface User {
  googleUserId: string,
  displayName: string,
  imageUrl: string
}

export const emptyUser: User = {
  googleUserId: "no-id",
  displayName: "no-displayName",
  imageUrl: "no-imageUrl",
};

export const newPlace: Place = {
  placeName: "",
  placeId: "",
  google_maps_link: "",
  comment: ""
};
