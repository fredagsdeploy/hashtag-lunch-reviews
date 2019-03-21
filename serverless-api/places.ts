import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export const get = async (event, context) => {
  var params = {
    TableName: "Places"
  };

  const data = await dynamodb.scan(params).promise();
  return createResponse(200, { places: data });
};

export const post = async (event, context) => {
  const placeName = event.queryStringParameters.name;

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
    await dynamodb.put(params);
  } catch (error) {
    return createResponse(400, error);
  }

  const createdPlace = await getPlaceByName(placeName);
  return createResponse(200, { createdPlace });
};

const getPlaceByName = async (placeName: string) => {
  const queryParams = {
    TableName: "Places",
    IndexName: "placeNameIndex",
    KeyConditionExpression: "placeName = :place_name",
    ExpressionAttributeValues: { ":place_name": placeName }
  };
  const res = await dynamodb.query(queryParams).promise();

  // if (res.Items.length == 0) {
  //   throw new Error(`No item in Places Table with name "${placeName}"`);
  // }
  // if (res.Items.length > 1) {
  //   throw new Error(
  //     `Multiple items Places Table with name "${placeName}" exists. Name should be unique.`
  //   );
  // }

  return res.Items || [];
};

const createResponse = (statusCode: number, body: object) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify(body)
  };
};
