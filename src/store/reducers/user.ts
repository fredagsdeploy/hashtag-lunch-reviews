import { Reducer } from "redux";
import { GoogleUser, User } from "../../types";

export type UserState =
  | {
      loaded: boolean;
      signedIn: true;
      user: User;
      googleUser: GoogleUser;
    }
  | {
      loaded: boolean;
      signedIn: false;
      user: null;
      googleUser: null;
    };

const initialUserState: UserState = {
  loaded: false,
  signedIn: false,
  googleUser: null,
  user: null
};

export const userReducer: Reducer<
  UserState,
  UpdateUserAction | SetSignedInAction | SignOutAction
> = (state = initialUserState, action) => {
  switch (action.type) {
    case "SET_SIGNED_IN":
      return {
        loaded: true,
        signedIn: true,
        user: action.user,
        googleUser: action.googleUser
      };
    case "UPDATE_USER":
      if (state.signedIn) {
        return {
          ...state,
          user: action.user
        };
      } else {
        return state;
      }
    case "SET_SIGNED_OUT":
      return { ...initialUserState, loaded: true };
    default:
      return state;
  }
};

interface UpdateUserAction {
  type: "UPDATE_USER";
  user: User;
}

export const updateUser = (user: User): UpdateUserAction => ({
  type: "UPDATE_USER",
  user
});

interface SetSignedInAction {
  type: "SET_SIGNED_IN";
  googleUser: GoogleUser;
  user: User;
}

export const setSignedIn = (
  googleUser: GoogleUser,
  user: User
): SetSignedInAction => ({
  type: "SET_SIGNED_IN",
  googleUser,
  user
});

interface SignOutAction {
  type: "SET_SIGNED_OUT";
}

export const setSignedOut = (): SignOutAction => ({
  type: "SET_SIGNED_OUT"
});
