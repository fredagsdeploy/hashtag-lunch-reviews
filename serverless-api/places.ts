"use strict";

const uuid = require("uuid/v1");

let AWS = require("aws-sdk");

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

module.exports.get = (event, context, callback) => {
  var params = {
    TableName: "Places"
  };

  dynamodb.scan(params, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          places: data
        })
      };
      callback(null, response);
    }
  });
};

module.exports.post = (event, context, callback) => {
  var params = {
    TableName: "Places",
    Item: {
      place_id: uuid(),
      name: event.queryStringParameters.name
    }
  };

  dynamodb.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      newPlace: "very added",
      places: [
        {
          id: "12",
          name: "Beijing8",
          description: "buns o dumplings"
        }
      ]
    })
  };

  callback(null, response);
};
