import { useCallback } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import config from "./config";
import { getUser, setToken } from "./lib/backend";
import { StoreState } from "./store/configureStore";
import { setSignedIn, setSignedOut } from "./store/reducers/user";
import { GoogleUser } from "./types";

let promiseCache: null | Promise<any> = null;
let resolved: boolean = false;

const useGoogleClientAuthApi = (): unknown => {
  if (!promiseCache) {
    promiseCache = new Promise(resolve => {
      window.gapi.load("client:auth2", resolve);
    })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        resolved = true;
      });
  }

  if (!resolved) {
    throw promiseCache;
  }

  return resolved;
};

let authPromise: Promise<any> | null = null;

const mapState = (state: StoreState) => ({
  loaded: state.user.loaded,
  signedIn: state.user.signedIn,
  googleUser: state.user.googleUser,
  user: state.user.user
});

const transformGoogleUser = (profile: gapi.auth2.BasicProfile): GoogleUser => ({
  id: profile.getId(),
  fullName: profile.getName(),
  givenName: profile.getGivenName(),
  familyName: profile.getFamilyName(),
  imageUrl: profile.getImageUrl(),
  email: profile.getEmail()
});

export const useGoogleAuth = () => {
  const state = useMappedState(mapState);

  const dispatch = useDispatch();

  useGoogleClientAuthApi();

  if (!authPromise) {
    authPromise = window.gapi.auth2
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        scope: "profile email"
      })
      .then((auth: gapi.auth2.GoogleAuth) => {
        auth.currentUser.listen(currentUser => {
          setToken(currentUser.getAuthResponse().id_token);

          const googleUser = transformGoogleUser(currentUser.getBasicProfile());

          getUser(googleUser.id).then(user => {
            dispatch(setSignedIn(googleUser, user));
          });
        });

        if (auth.isSignedIn.get()) {
          const currentUser = auth.currentUser.get();
          const googleUser = transformGoogleUser(currentUser.getBasicProfile());

          setToken(currentUser.getAuthResponse().id_token);

          return getUser(googleUser.id).then(user => {
            dispatch(setSignedIn(googleUser, user));
          });
        } else {
          dispatch(setSignedOut());
        }
      });
  }

  const authorize = useCallback(() => {
    window.gapi.auth2.getAuthInstance().signIn();
  }, []);

  const signOut = useCallback(() => {
    window.gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => dispatch(setSignedOut()));
  }, []);

  if (!state.loaded) {
    throw authPromise;
  }

  return {
    googleUser: state.googleUser,
    user: state.user,
    signOut,
    authorize
  };
};
