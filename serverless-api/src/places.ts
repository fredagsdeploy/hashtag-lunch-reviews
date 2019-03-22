import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse, parseJSON } from "./common";
import {
  getAllPlaces,
  savePlace,
  Place,
  getPlaceByName
} from "./repository/places";

const createPlace = (
  placeId: string,
  placeName: string,
  comment: string,
  google_maps_link: string
): Place => ({
  placeId,
  placeName,
  comment,
  google_maps_link
});

export const get = async (event, context) => {
  var params = {
    TableName: "Places"
  };

  const places = await getAllPlaces();
  return createResponse(200, { places });
};

export type PlaceInput = Place;

export const post = async (event, context) => {
  const body = parseJSON(event.body) as Partial<PlaceInput>;
  const { placeName, comment, google_maps_link } = body;

  if (!placeName || !comment || !google_maps_link) {
    return createResponse(400, { error: "Missing parameters" });
  }

  const place = await getPlaceByName(placeName);
  if (place) {
    return createResponse(409, { error: "placeName already exists" });
  }

  try {
    const place = await savePlace(
      createPlace(uuid(), placeName, comment, google_maps_link)
    );
    return createResponse(200, place);
  } catch (error) {
    return createResponse(400, error);
  }
};
