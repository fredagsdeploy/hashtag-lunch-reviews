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

<<<<<<< HEAD
  if (event.pathParameters.googleUserId !== context.userId) {
=======
  if (event.pathParameters.googleUserId !== event.requestContext.authorizer.userId) {
>>>>>>> master
    return createResponse(400, { message: "Mismatching user id in path and calling user" });
  }


<<<<<<< HEAD
  if (user.googleUserId && user.googleUserId !== context.userId) {
=======
  if (user.googleUserId && user.googleUserId !== event.requestContext.authorizer.userId) {
>>>>>>> master
    return createResponse(400, { message: "Mismatching user id in body and calling user" });
  }


<<<<<<< HEAD
  const updatedUser = await updateUser(context.userId, user);
=======
  const updatedUser = await updateUser(event.requestContext.authorizer.userId, user);
>>>>>>> master
  return createResponse(200, updatedUser)


}