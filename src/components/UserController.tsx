import React from "react";
import { User } from "../types";

interface Props {
  user: User;
}

export const UserController = ({ user }: Props) => {
  return (
    <>
      {user.fullName}
      <img src={user.imageUrl} />
    </>
  );
};
