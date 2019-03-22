import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse, parseJSON } from "./common";
import { getAllPlaces, savePlace, Place } from "./repository/places";

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
  const { placeId, placeName, comment, google_maps_link } = body;

  if (!placeId || !placeName || !comment || !google_maps_link) {
    return createResponse(400, { error: "Missing parameters" });
  }

  const places = await getPlaceByName(placeName);
  if (places.length > 0) {
    return createResponse(409, { error: "placeName already exists" });
  }

  var params = {
    TableName: "Places",
    Item: {
      placeId: uuid(),
      placeName: placeName
    }
  };

  try {
    const place = await savePlace(
      createPlace(
        uuid(),
        placeName,
        event.queryStringParameters.comment,
        event.queryStringParameters.google_maps_link
      )
    );
    return createResponse(200, { place });
  } catch (error) {
    return createResponse(400, error);
  }
};
