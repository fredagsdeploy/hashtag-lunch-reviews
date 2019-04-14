import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";

export const parseJSON = (input: string | null) => JSON.parse(input || "");

export const createResponse = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
};

export type LambdaHandler = (
  event: APIGatewayEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;
