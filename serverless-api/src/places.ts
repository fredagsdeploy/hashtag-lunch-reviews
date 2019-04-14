import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import { createResponse, parseJSON, LambdaHandler } from "./common";
import {
  getAllPlaces,
  savePlace,
  Place,
  getPlaceByName,
  getPlaceById,
  getPlaceByGoogleId
} from "./repository/places";
import { getGooglePlace } from "./googlePlaces/googlePlaces";

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

  if (place.googlePlaceId) {
    const googlePlace = await getGooglePlace(place.googlePlaceId).then(r =>
      r.json()
    );

    return createResponse(200, { ...place, googlePlace: googlePlace.result });
  }

  return createResponse(200, place);
};

export type PlaceInput = Place;

export const post: LambdaHandler = async (event, context) => {
  if (!event.body) {
    return createResponse(400, { error: "Missing body" });
  }

  try {
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
        const googlePlace = await getGooglePlace(googlePlaceId).then(r =>
          r.json()
        );

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

    try {
      const place = await savePlace(
        createPlace(
          uuid(),
          placeName,
          comment ? comment : " ",
          googlePlaceId ? googlePlaceId : " "
        )
      );
      return createResponse(200, place);
    } catch (error) {
      return createResponse(400, error);
    }
  } catch (error) {
    return createResponse(400, error);
  }
};
