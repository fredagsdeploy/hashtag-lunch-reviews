import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export interface Place {
  placeId: string;
  placeName: string;
  comment: string;
  google_maps_link: string;
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

  await dynamodb.put(params).promise();

  const place = await getPlaceById(placeInput.placeId);

  return place!;
};
