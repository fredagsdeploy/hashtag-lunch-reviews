import { dynamodb } from "./documentClient";
import { GooglePlaceResult } from "../googlePlaces/types";
import PlacesAutocomplete from "react-places-autocomplete";

export interface Place {
  placeId: string;
  createdAt: Date;
  placeName: string;
  comment?: string;
  googlePlaceId?: string;
  googlePlace?: GooglePlaceResult;
  photoUrl?: string;
}

export type PlaceInput = {
  placeName: string;
  comment?: string;
  googlePlaceId?: string;
  photoUrl?: string;
};

export const getPlaceById = async (
  placeId: string
): Promise<Place | undefined> => {
  const getParams = {
    TableName: "Places",
    Key: {
      placeId
    }
  };

  const result = await dynamodb.get(getParams).promise();
  if (!result.Item) {
    return undefined;
  }
  const place = result.Item as Place;
  place.createdAt = dateFromUUID(place.placeId);
  return place;
};

export const getPlaceByName = async (
  placeName: string
): Promise<Place | undefined> => {
  const queryParams = {
    TableName: "Places",
    IndexName: "placeNameIndex",
    KeyConditionExpression: "placeName = :place_name",
    ExpressionAttributeValues: { ":place_name": placeName }
  };
  const res = await dynamodb.query(queryParams).promise();

  if (!res.Items || !res.Items[0]) {
    return undefined;
  }

  const place = res.Items[0] as Place;
  place.createdAt = dateFromUUID(place.placeId);
  return place;
};

export const getPlaceByGoogleId = async (
  googlePlaceId: string
): Promise<Place | undefined> => {
  const queryParams = {
    TableName: "Places",
    IndexName: "placeGoogleIdIndex",
    KeyConditionExpression: "googlePlaceId = :google_place_id",
    ExpressionAttributeValues: { ":google_place_id": googlePlaceId }
  };
  const res = await dynamodb.query(queryParams).promise();

  if (!res.Items) {
    return undefined;
  }

  const place = res.Items[0] as Place;
  place.createdAt = dateFromUUID(place.placeId);
  return place;
};

export const getAllPlaces = async (): Promise<Place[]> => {
  var params = {
    TableName: "Places"
  };

  const response = await dynamodb.scan(params).promise();

  const places = response.Items as Place[];
  return places.map((p: Place) => ({
    ...p,
    createdAt: dateFromUUID(p.placeId)
  }));
};

export const savePlace = async (placeInput: Place): Promise<Place> => {
  var params = {
    TableName: "Places",
    Item: placeInput
  };

  const placeWithSameName = await getPlaceByName(placeInput.placeName);
  if (placeWithSameName) {
    throw new Error("A place with that name already exists.");
  }

  await dynamodb.put(params).promise();

  const place = await getPlaceById(placeInput.placeId);

  return place!;
};

export const updatePlace = async (placeInput: Place): Promise<Place> => {
  var params = {
    TableName: "Places",
    Item: placeInput
  };

  const placeWithSameName = await getPlaceByName(placeInput.placeName);
  if (!placeWithSameName) {
    throw new Error(
      "A place with that name doesn't already exist. (You're trying to update a place)"
    );
  }

  await dynamodb.put(params).promise();

  const place = await getPlaceById(placeInput.placeId);

  return place!;
};

const unixtimeFromUUID = (uuid: string) => {
  var uuid_arr = uuid.split("-"),
    time_str = [uuid_arr[2].substring(1), uuid_arr[1], uuid_arr[0]].join("");
  return parseInt(time_str, 16);
};

const dateFromUUID = (uuid: string) => {
  var int_time = unixtimeFromUUID(uuid) - 122192928000000000,
    int_millisec = Math.floor(int_time / 10000);
  return new Date(int_millisec);
};
