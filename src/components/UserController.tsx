import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useUserContext } from "../customHooks/useUserContext";
import { putUser } from "../lib/backend";
import { updateUser } from "../store/reducers/user";

export const UserController = () => {
  const user = useUserContext()!;

  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState(user.displayName);

  const saveUser = () => {
    putUser({ ...user, displayName }).then(updatedUser => {
      dispatch(updateUser(updatedUser));
    });
  };

  return (
    <>
      {user.displayName}
      <img src={user.imageUrl} alt="User" />
      <input
        type="text"
        onChange={e => setDisplayName(e.target.value)}
        value={displayName}
      />
      <button type="button" onClick={saveUser}>
        Submit!!
      </button>
    </>
  );
};
