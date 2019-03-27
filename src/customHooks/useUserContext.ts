import { emptyUser } from "../types";
import React, { useContext } from "react";

export const UserContext = React.createContext(emptyUser);

export const useUserContext = () => useContext(UserContext);
