import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import fetch from "node-fetch";
import { createResponse, parseJSON, LambdaHandler } from "./common";
import {
  getAllPlaces,
  savePlace,
  Place,
  getPlaceByName,
  getPlaceById,
  getPlaceByGoogleId
} from "./repository/places";
import config from "../config";

const createPlace = (
  placeId: string,
  placeName: string,
  comment?: string,
  googlePlaceId?: string
): Place => ({
  placeId,
  placeName,
  comment,
  googlePlaceId
});

export const get: LambdaHandler = async () => {
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

  if (place.googlePlaceId) {
    const googlePlace = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
        place.googlePlaceId
      }&key=${config.googlePlacesApiKey}`
    ).then(r => r.json());

    return createResponse(200, { ...place, googlePlace: googlePlace.result });
  }

  return createResponse(200, place);
};

export type PlaceInput = Place;

export const post: LambdaHandler = async (event, context) => {
  const body = parseJSON(event.body) as Partial<PlaceInput>;
  const { comment, googlePlaceId } = body;
  let { placeName } = body;

  if (googlePlaceId) {
    const place = await getPlaceByGoogleId(googlePlaceId);
    if (place) {
      return createResponse(409, {
        error: "Place with googlePlaceId already exists"
      });
    } else {
      const googlePlace = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${googlePlaceId}&key=${
          config.googlePlacesApiKey
        }`
      ).then(r => r.json());

      placeName = googlePlace.result.name;
    }
  }

  if (!placeName) {
    return createResponse(400, { error: "Missing parameters" });
  }

  if (placeName) {
    const place = await getPlaceByName(placeName);
    if (place) {
      return createResponse(409, { error: "placeName already exists" });
    }
  }

  console.log(placeName, comment, googlePlaceId);
  try {
    const place = await savePlace(
      createPlace(uuid(), placeName, comment ? comment : " ", googlePlaceId)
    );
    return createResponse(200, place);
  } catch (error) {
    return createResponse(400, error);
  }
};
