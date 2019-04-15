import { useState, useEffect, useCallback } from "react";
import config from "./config";
import { GoogleUser, User } from "./types";
import { unstable_createResource } from "react-cache";
import { setToken, getUser } from "./lib/backend";

type GoogleAPI = string | { name: string; version: string };

export const googleApiFetcher = unstable_createResource(
  (libName: GoogleAPI) =>
    new Promise(resolve => {
      if (typeof libName === "string") {
        window.gapi.load(libName, resolve);
      } else {
        window.gapi.load(libName.name, libName.version, resolve);
      }
    })
);

export const useGoogleAuth = () => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [lunchUser, setLunchUser] = useState<User | null>(null);
  googleApiFetcher.read("client:auth2");

  useEffect(() => {
    if (googleUser) {
      getUser(googleUser.id).then(setLunchUser)
    }
  }, [googleUser])

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
