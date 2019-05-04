export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface Rating extends Place {
  rating: number;
  normalizedRating: number;
  rank: number;
}
export interface Review {
  reviewId: string;
  user: User;
  placeId: string;
  rating: number;
  comment: string;
}

export interface ReviewRating {
  review: Review;
  rating: Rating;
}

export interface NewReview extends Omit<Review, "reviewId" | "user"> {
  userId: string;
}

export interface Place {
  placeId: string;
  placeName: string;
  googlePlaceId?: string;
  googlePlace?: GooglePlaceResult;
  google_maps_link: string;
  comment: string;
  photoUrl?: string;
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
  googleUserId: string;
  displayName: string;
  imageUrl: string;
}

export const emptyUser: User = {
  googleUserId: "no-id",
  displayName: "no-displayName",
  imageUrl: "no-imageUrl"
};

export const newPlace: Place = {
  placeName: "",
  placeId: "",
  google_maps_link: "",
  comment: ""
};

export interface GooglePlaceResult {
  formatted_address: string;
  types: string[];
  website: string;
  icon: string;
  address_components: Addresscomponent[];
  photos: Photo[];
  url: string;
  scope: string;
  name: string;
  opening_hours: Openinghours;
  geometry: Geometry;
  vicinity: string;
  id: string;
  adr_address: string;
  plus_code: Pluscode;
  place_id: string;
}

interface Pluscode {
  compound_code: string;
  global_code: string;
}

interface Geometry {
  viewport: Viewport;
  location: Southwest;
}

interface Viewport {
  southwest: Southwest;
  northeast: Southwest;
}

interface Southwest {
  lng: number;
  lat: number;
}

interface Openinghours {
  open_now: boolean;
  periods: Period[];
  weekday_text: string[];
}

interface Period {
  close: Close;
  open: Close;
}

interface Close {
  day: number;
  time: string;
}

interface Photo {
  width: number;
  html_attributions: string[];
  photo_reference: string;
  height: number;
}

interface Addresscomponent {
  long_name: string;
  short_name: string;
  types: string[];
}
