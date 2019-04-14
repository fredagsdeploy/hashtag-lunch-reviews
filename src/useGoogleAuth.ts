import { useState, useEffect, useCallback } from "react";
import config from "./config";
import { User } from "./types";
import { unstable_createResource } from "react-cache";
import { setToken } from "./lib/backend";

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
  const [user, setUser] = useState<User | null>(null);
  googleApiFetcher.read("client:auth2");

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

          setUser(user);
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

            setUser(user);
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
      .then(() => setUser(null));
  }, []);

  return {
    user,
    signOut,
    authorize
  };
};
