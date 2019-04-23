import { dynamodb } from "./documentClient";

export interface User {
  googleUserId: string;
  displayName: string;
  imageUrl: string;
}

export const getUserById = async (
  googleUserId: string
): Promise<User | undefined> => {
  const getParams = {
    TableName: "Users",
    Key: {
      googleUserId
    }
  };

  const resp = await dynamodb.get(getParams).promise();

  return resp.Item as User | undefined;
};

export const saveUser = async (userInput: User): Promise<User> => {
  const params = {
    TableName: "Users",
    Item: userInput
  };

  await dynamodb.put(params).promise();

  return (await getUserById(userInput.googleUserId))!;
};

export const updateUser = async (
  googleUserId: string,
  userInput: Partial<User>
): Promise<User> => {
  const user = await getUserById(googleUserId);

  if (!user) {
    throw new Error(`No user with id: ${googleUserId}`);
  }

  const params = {
    TableName: "Users",
    Item: { ...user, ...userInput }
  };

  await dynamodb.put(params).promise();

  return (await getUserById(googleUserId))!;
};
