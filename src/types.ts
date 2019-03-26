import { string } from "prop-types";

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

export interface Place {
  placeId: string;
  placeName: string;
  google_maps_link: string;
  comment: string;
}

export interface User {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  imageUrl: string;
  email: string;
}

export const emptyUser = {
  id: "no-id",
  fullName: "no-fullName",
  givenName: "no-givenName",
  familyName: "no-familyName",
  imageUrl: "no-imageUrl",
  email: "no-mail"
};

export const newPlace: Place = {
  placeName: "",
  placeId: "",
  google_maps_link: "",
  comment: ""
};
