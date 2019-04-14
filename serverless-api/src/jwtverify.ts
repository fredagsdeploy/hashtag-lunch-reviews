import * as jwt from "jsonwebtoken";
import { createResponse, LambdaHandler } from "./common";
import fetch from "node-fetch";

import { APIGatewayEvent, Context } from "aws-lambda";

const decodeJwt = async (id_token: string) => {
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
  console.log(`Entered jwt verify ${JSON.stringify(event)}   Context: ${JSON.stringify(context)}`);

  if (!token) {
    console.log("Token missing");
    callback("Unauthorized");
    return;
  }
  console.log(`Token found: ${token}`);

  const arnParts = event.methodArn.split("/");
  const resourceArn = arnParts.slice(0, arnParts.length - 2).join("/") + "/*";


  decodeJwt(token).then(
    valid => {
      if (valid && typeof valid !== "string") {
        console.log("Return Allow");

        callback(
          null,
          generatePolicy((valid as any).sub, "Allow", resourceArn)
        );
      } else {
        console.log("Return Deny, not valid");
        callback(null, generatePolicy("invalid_user", "Deny", resourceArn));
      }
    },
    (err: Error) => {
      console.log(`Return Deny, error ${err}`);
      callback(null, generatePolicy("invalid_user", "Deny", resourceArn));
    }
  );
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId: string, effect: any, resource: any) {
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
  console.log(`Adding userId ${principalId} to context`);

  authResponse.context = {
    userId: principalId
  };
  return authResponse;
};
