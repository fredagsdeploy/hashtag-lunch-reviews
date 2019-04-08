import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse, parseJSON, LambdaHandler } from "./common";
import {
  getAllPlaces,
  savePlace,
  Place,
  getPlaceByName,
  getPlaceById
} from "./repository/places";
import { JsonWebTokenError } from "jsonwebtoken";

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

export const get: LambdaHandler = async (event, context) => {

  const places = await getAllPlaces();
  return createResponse(200, { places });
};

export type GetByIdRequest = {
  placeId: string;
};

export const getById: LambdaHandler = async (event, context) => {
  if (!event.pathParameters || !event.pathParameters.placeId) {
    return createResponse(400, { message: "Missing path parameter" });
  }

  const place = await getPlaceById(event.pathParameters.placeId);
  if (!place) {
    return createResponse(404, { message: "No place with that id" });
  }
  return createResponse(200, place);
};

export type PlaceInput = Place;

export const post: LambdaHandler = async (event, context) => {
  if (!event.body) {
    return createResponse(400, { error: "Missing body" });
  }

  try {
    const body = JSON.parse(event.body) as Partial<PlaceInput>;
    //const body = parseJSON(event.body) as Partial<PlaceInput>;

    const { placeName, comment, google_maps_link } = body;

    if (!placeName || !comment || !google_maps_link) {
      return createResponse(400, {
        error: "Missing parameters, need placeName, comment, google_maps_link"
      });
    }

    try {
      const place = await getPlaceByName(placeName);
      if (place) {
        return createResponse(409, { error: "placeName already exists" });
      }
    } catch (error) {
      return createResponse(400, error);
    }

    try {
      const place = await savePlace(
        createPlace(uuid(), placeName, comment, google_maps_link)
      );
      return createResponse(200, place);
    } catch (error) {
      return createResponse(400, error);
    }
  } catch (error) {
    return createResponse(400, error);
  }
};
