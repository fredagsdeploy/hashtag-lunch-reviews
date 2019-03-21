import { string } from "prop-types";

export interface Rating {
  id: string;
  name: string;
  google_maps_link: string;
  rating: number;
  normalized_rating: number;
  comment: string;
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
  name: string;
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

export const newPlace = {
  name: "",
  google_maps_link: "",
  comment: ""
};
