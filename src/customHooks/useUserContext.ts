// @ts-ignore
import { useSelector } from "react-redux";
import { StoreState } from "../store/configureStore";
import { User } from "../types";

export const useUserContext = (): User | null =>
  useSelector((state: StoreState): User | null => state.user.user, []);
