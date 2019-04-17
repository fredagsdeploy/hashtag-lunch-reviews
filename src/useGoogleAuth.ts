import { useCallback, useEffect, useState } from "react";
import config from "./config";
import { getUser, setToken } from "./lib/backend";
import { GoogleUser, User } from "./types";

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

export const useGoogleAuth = () => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [lunchUser, setLunchUser] = useState<User | null>(null);

  useGoogleClientAuthApi();

  useEffect(
    () => {
      if (googleUser) {
        getUser(googleUser.id).then(setLunchUser);
      }
    },
    [googleUser]
  );

  useEffect(() => {
    window.gapi.auth2
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        scope: "profile email"
      })
      .then(() => {
        if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          const currentUser = window.gapi.auth2
            .getAuthInstance()
            .currentUser.get();
          const profile = currentUser.getBasicProfile();
          const user = {
            id: profile.getId(),
            fullName: profile.getName(),
            givenName: profile.getGivenName(),
            familyName: profile.getFamilyName(),
            imageUrl: profile.getImageUrl(),
            email: profile.getEmail()
          };

          setToken(currentUser.getAuthResponse().id_token);

          setGoogleUser(user);
        }
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(console.log);

        window.gapi.auth2
          .getAuthInstance()
          .currentUser.listen((currentUser: any) => {
            setToken(currentUser.getAuthResponse().id_token);

            const profile = currentUser.getBasicProfile();
            const user = {
              id: profile.getId(),
              fullName: profile.getName(),
              givenName: profile.getGivenName(),
              familyName: profile.getFamilyName(),
              imageUrl: profile.getImageUrl(),
              email: profile.getEmail()
            };

            setGoogleUser(user);
          });
      });
  }, []);

  const authorize = useCallback(() => {
    window.gapi.auth2.getAuthInstance().signIn();
  }, []);

  const signOut = useCallback(() => {
    window.gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => setGoogleUser(null));
  }, []);

  return {
    googleUser,
    user: lunchUser,
    signOut,
    authorize
  };
};
