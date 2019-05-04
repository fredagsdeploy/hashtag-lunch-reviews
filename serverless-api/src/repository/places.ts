import { dynamodb } from "./documentClient";
import { GooglePlaceResult } from "../googlePlaces/types";

export interface Place {
  placeId: string;
  placeName: string;
  comment?: string;
  googlePlaceId?: string;
  googlePlace?: GooglePlaceResult;
  photoUrl?: string;
}

export const getPlaceById = async (
  placeId: string
): Promise<Place | undefined> => {
  const getParams = {
    TableName: "Places",
    Key: {
      placeId
    }
  };

  const place = await dynamodb.get(getParams).promise();

  return place.Item as Place | undefined;
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

  return res.Items[0] as Place | undefined;
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

  return res.Items[0] as Place | undefined;
};

export const getAllPlaces = async (): Promise<Place[]> => {
  var params = {
    TableName: "Places"
  };

  const response = await dynamodb.scan(params).promise();

  return (response.Items || []) as Place[];
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
