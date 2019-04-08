import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const asd = async id_token => {
  const pemResp = await fetch(
    "https://www.googleapis.com/oauth2/v1/certs"
  ).then(r => r.json());

  const decoded = jwt.decode(id_token, { complete: true });
  if (decoded && typeof decoded !== "string") {
    return jwt.verify(id_token, pemResp[decoded.header.kid]);
  }
  return null;
};

exports.handler = async function(event, context, callback) {
  var token = event.authorizationToken;
  if (!token) {
    callback("Unauthorized");
    return;
  }

  const valid = await asd(token);
  if (valid) {
    callback(null, generatePolicy(valid.sub, "Allow", event.methodArn));
  } else {
    callback(null, generatePolicy("invalid_user", "Deny", event.methodArn));
  }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
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
