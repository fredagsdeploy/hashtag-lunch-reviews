import { useSelector } from "react-redux";
import { StoreState } from "../store/configureStore";
import { User } from "../types";

export const useUserContext = (): User | null =>
  useSelector<User | null, StoreState>(state => state.user.user, []);
