import * as jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { Context } from "aws-lambda";
import { getUserById, saveUser } from "./repository/users";

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

interface DecodedJWT {
  sub: string;
  name: string;
  picture: string;
}

const checkUser = async (decodedJwt: DecodedJWT) => {
  const maybeUser = await getUserById(decodedJwt.sub);
  if (!maybeUser) {
    console.log(`Creating new user for googleUserId ${decodedJwt.sub}`);

    await saveUser({
      googleUserId: decodedJwt.sub,
      imageUrl: decodedJwt.picture,
      displayName: decodedJwt.name
    });
  }
};

export const verify = async (event: any, context: Context) => {
  const token = event.authorizationToken;
  console.log(
    `Entered jwt verify ${JSON.stringify(event)}   Context: ${JSON.stringify(
      context
    )}`
  );

  if (!token) {
    console.log("Token missing");
    throw new Error("Unauthorized");
    return;
  }
  console.log(`Token found: ${token}`);

  const arnParts = event.methodArn.split("/");
  const resourceArn = arnParts.slice(0, arnParts.length - 2).join("/") + "/*";

  try {
    const valid = await decodeJwt(token);
    if (valid && typeof valid !== "string") {
      console.log("Return Allow");
      const decoded = valid as DecodedJWT;
      try {
        await checkUser(decoded);
      } catch (error) {
        console.log("Error on checkUser", error);
        throw error;
      }
      return generatePolicy(decoded.sub, "Allow", resourceArn);
    } else {
      console.log("Return Deny, not valid");
      return generatePolicy("invalid_user", "Deny", resourceArn);
    }
  } catch (err) {
    console.log(`Return Deny, error ${err}`);
    return generatePolicy("invalid_user", "Deny", resourceArn);
  }
};

// Help function to generate an IAM policy
const generatePolicy = function(
  principalId: string,
  effect: any,
  resource: any
) {
  const authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne: any = {};
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
