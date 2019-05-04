import { v1 as uuid } from "uuid";
import { createResponse, LambdaHandler, parseJSON } from "./common";
import {
  getAllPlaces,
  getPlaceByGoogleId,
  getPlaceById,
  getPlaceByName,
  Place,
  savePlace,
  updatePlace,
  PlaceInput
} from "./repository/places";
import { getGooglePlace, getPhotoUrl } from "./googlePlaces/googlePlaces";
import { decoratePlace } from "./ratings";
import { GooglePlacesResponse } from "./googlePlaces/types";

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

export const getById: LambdaHandler = async (event, context) => {
  console.log(
    `Get place by id ${JSON.stringify(event)} ${JSON.stringify(context)}`
  );

  if (!event.pathParameters || !event.pathParameters.placeId) {
    return createResponse(400, { message: "Missing path parameter" });
  }

  const place = await getPlaceById(event.pathParameters.placeId);
  if (!place) {
    return createResponse(404, { message: "No place with that id" });
  }

  return createResponse(200, place);
};

export const post: LambdaHandler = async (event, context) => {
  if (!event.body) {
    return createResponse(400, { error: "Missing body" });
  }

  try {
    const body = parseJSON(event.body) as Partial<PlaceInput>;
    const { comment, googlePlaceId } = body;
    let { placeName } = body;

    let photoUrl: string | null = null;
    let googlePlace: GooglePlacesResponse | null = null;
    if (googlePlaceId) {
      const place = await getPlaceByGoogleId(googlePlaceId);
      if (place) {
        return createResponse(409, {
          error: "Place with googlePlaceId already exists"
        });
      } else {
        googlePlace = await getGooglePlace(googlePlaceId);
        photoUrl = await getPhotoUrl(googlePlace.result);
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
      let newPlace = createPlace(
        uuid(),
        placeName,
        comment ? comment : " ",
        googlePlaceId ? googlePlaceId : " "
      );

      newPlace.googlePlace = googlePlace ? googlePlace.result : undefined;
      newPlace.photoUrl = photoUrl || undefined;

      const place = await savePlace(newPlace);

      const rating = await decoratePlace(place, []);
      return createResponse(200, rating);
    } catch (error) {
      return createResponse(400, error);
    }
  } catch (error) {
    return createResponse(400, error);
  }
};

export const migratePhotos = async () => {
  const places = await getAllPlaces();

  const newPlaces = await Promise.all(
    places
      .filter(p => p.googlePlaceId && p.googlePlaceId !== " ")
      .map(async p => {
        try {
          if (!p.googlePlaceId) {
            return;
          }

          const googlePlace = await getGooglePlace(p.googlePlaceId);
          const photoUrl = await getPhotoUrl(googlePlace.result);
          p.googlePlace = googlePlace.result;
          p.photoUrl = photoUrl || undefined;

          return await updatePlace(p);
        } catch (error) {
          console.log("Could not update", p, error);
        }
      })
  );

  return createResponse(200, { newPlaces });
};
