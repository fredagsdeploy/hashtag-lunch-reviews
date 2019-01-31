import React, { useEffect, useState } from "react";

import { StatsController } from "./components/StatsController";
import { initSpreadsheetApi } from "./lib/spreadsheet";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App = () => {
  const [loadingInit, setLoadingInit] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    window.gapi.load("client", () => {
      initSpreadsheetApi()
        .then(() => setLoadingInit(false))
        .catch((err: Error) => {
          setError(err);
        });
    });
  }, []);

  return (
    <div className="App">
      {loadingInit ? <h1>Loading</h1> : <StatsController />}
      {error && <h2>{error.message}</h2>}
    </div>
  );
};
