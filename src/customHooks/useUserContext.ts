import { useMappedState } from "redux-react-hook";
import { StoreState } from "../store/configureStore";
import { User } from "../types";

const mapState = (state: StoreState): User | null => state.user.user;

export const useUserContext = () => useMappedState(mapState);
