import React, { useState } from "react";
import { useDispatch } from "redux-react-hook";
import { useUserContext } from "../customHooks/useUserContext";
import { putUser } from "../lib/backend";
import { updateUser } from "../store/reducers/user";

export const UserController = () => {
  const user = useUserContext()!;

  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState(user.displayName);

  const saveUser = () => {
    putUser({ ...user, displayName }).then(user => {
      dispatch(updateUser(user));
    });
  };

  return (
    <>
      {user.displayName}
      <img src={user.imageUrl} alt="User image" />
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
