import { v1 as uuid } from "uuid";
import * as AWS from "aws-sdk";

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET" // needed if you don't have aws credentials at all in env
});

export const getReviews = (event, context, callback) => {
  var params = {
    TableName: "Reviews"
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
          reviews: data
        })
      };
      callback(null, response);
    }
  });
};

export const postReviews = (event, context, callback) => {
  var params = {
    TableName: "Reviews",
    Item: {
      review_id: uuid(),
      user_id: event.queryStringParameters.name, // TODO, do select before to check for existance
      place_id: event.queryStringParameters.place_id, // TODO. do select before to check for existance
      rating: event.queryStringParameters.rating,
      comment: event.queryStringParameters.comment
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
      newPlace: "very added"
    })
  };

  callback(null, response);
};
