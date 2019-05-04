import fetch from "node-fetch";
import config from "../../config";
import { GooglePlaceResult, GooglePlacesResponse } from "./types";

const fields: string[] = [
  "address_component",
  "adr_address",
  "alt_id",
  "formatted_address",
  "geometry",
  "icon",
  "id",
  "name",
  "permanently_closed",
  "photo",
  "place_id",
  "plus_code",
  "scope",
  "type",
  "url",
  // "utc_offset",
  "vicinity",
  "price_level",
  //"formatted_phone_number",
  //"international_phone_number",
  "opening_hours",
  "website"
  // "rating",
  // "review",
  // "user_ratings_total"
];

export const getGooglePlace = (
  googlePlaceId: string
): Promise<GooglePlacesResponse> =>
  fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${googlePlaceId}&key=${
      config.googlePlacesApiKey
    }&fields=${fields.join(",")}`
  ).then(r => r.json());

export const getPhotoUrl = (
  googlePlace: GooglePlaceResult
): Promise<string | null> =>
  fetch(
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${
      googlePlace.photos[0].photo_reference
    }&key=${config.googlePlacesApiKey}`,
    { redirect: "manual" }
  ).then(r => r.headers.get("location"));
