import { createResponse, LambdaHandler, parseJSON } from "./common";
import { User, updateUser, getUserById } from "./repository/users";


export const getUser: LambdaHandler = async (event, context) => {
  if (!event.pathParameters || !event.pathParameters.googleUserId) {
    return createResponse(400, { message: "Missing path parameter" });
  }


  const user = await getUserById(event.pathParameters.googleUserId);
  if (!user) {
    return createResponse(404, { message: `No user for id ${event.pathParameters.googleUserId}` })
  }
  return createResponse(200, user)
}

export const putUser: LambdaHandler = async (event, context) => {
  const user: Partial<User> = parseJSON(event.body);

  if (!event.pathParameters || !event.pathParameters.googleUserId) {
    return createResponse(400, { message: "Missing path parameter" });
  }

  if (event.pathParameters.googleUserId !== context.userId) {
    return createResponse(400, { message: "Mismatching user id in path and calling user" });
  }


  if (user.googleUserId && user.googleUserId !== context.userId) {
    return createResponse(400, { message: "Mismatching user id in body and calling user" });
  }


  const updatedUser = await updateUser(context.userId, user);
  return createResponse(200, updatedUser)


}