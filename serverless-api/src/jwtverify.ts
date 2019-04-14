import * as jwt from "jsonwebtoken";
import { createResponse, LambdaHandler } from "./common";
import fetch from "node-fetch";

import { APIGatewayEvent, Context } from "aws-lambda";

const asd = async (id_token: string) => {
  const pemResp = await fetch(
    "https://www.googleapis.com/oauth2/v1/certs"
  ).then(r => r.json());

  const decoded = jwt.decode(id_token, { complete: true });

  if (decoded && typeof decoded !== "string") {
    return jwt.verify(id_token, pemResp[decoded.header.kid]);
  }
  return null;
};

export const verify = (event: any, context: Context, callback) => {
  var token = event.authorizationToken;

  if (!token) {
    callback("Unauthorized");
    return;
  }

  asd(token).then(
    valid => {
      if (valid && typeof valid !== "string") {
        callback(
          null,
          generatePolicy((valid as any).sub, "Allow", event.methodArn)
        );
      } else {
        callback(null, generatePolicy("invalid_user", "Deny", event.methodArn));
      }
    },
    (err: Error) => {
      callback(null, generatePolicy("invalid_user", "Deny", event.methodArn));
    }
  );
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId: string, effect: any, resource: any) {
  var authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument: any = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne: any = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    userId: principalId
  };
  return authResponse;
};
