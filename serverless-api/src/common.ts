import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { Context } from "aws-sdk/clients/costexplorer";

export const createResponse = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify(body)
  };
};

export type LambdaHandler = (
  event: APIGatewayEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;
