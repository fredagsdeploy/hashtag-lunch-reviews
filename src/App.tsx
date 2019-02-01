import React, { useEffect, useState } from "react";

import { StatsController } from "./components/StatsController";
import { initSpreadsheetApi } from "./lib/spreadsheet";

import config from "./config";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App = () => {
  const [loadingInit, setLoadingInit] = useState(true);
  const [error, setError] = useState<Error | null | string>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    window.gapi.load("client", () => {
      initSpreadsheetApi()
        .then(() => setLoadingInit(false))
        .catch((err: Error) => {
          setError(err);
        });
    });
    window.gapi.load("client:auth2", initClient);
  }, []);

  const authorizeGoogle = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  const initClient = () => {
    window.gapi.client
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        discoveryDocs: config.discoveryDocs,
        scope: config.scopes
      })
      .then(
        () => {
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(setLoggedIn);
          setLoggedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        (error: Error) => setError(JSON.stringify(error, null, 2))
      );
  };

  if (!loggedIn) {
    return (
      <>
        <h1>Authorise google to use this page.</h1>
        <input onClick={authorizeGoogle} type="button" value="Authorize!" />
      </>
    );
  }

  return (
    <div className="App">
      <input type="button" value="Logout" onClick={signOut} />
      {loadingInit ? <h1>Loading</h1> : <StatsController />}
      {error && <h2>{error}</h2>}
    </div>
  );
};
