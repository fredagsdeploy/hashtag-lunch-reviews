import React, { useState } from "react";
import { useUserContext } from "../customHooks/useUserContext";
import { User } from "../types";
import { putUser } from "../lib/backend";


const saveUser = (displayName: string, user: User) => {
  putUser({ ...user, displayName });
}

export const UserController = () => {
  const user = useUserContext();
  const [displayName, setDisplayName] = useState(user.displayName);
  return (
    <>
      {user.displayName}
      <img src={user.imageUrl} />
      <input type="text" onChange={e => setDisplayName(e.target.value)} value={displayName} />
      <button type="button" onClick={e => { saveUser(displayName, user) }}>Submit!!</button>
    </>
  );
};
