import React from "react";
import { useUserContext } from "../customHooks/useUserContext";


export const UserController = () => {
  const user = useUserContext();
  return (
    <>
      {user.fullName}
      <img src={user.imageUrl} />
    </>
  );
};
