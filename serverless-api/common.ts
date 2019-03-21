export const createResponse = (statusCode: number, body: object) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify(body)
  };
};
