import React from "react";

import { StatsController } from "./components/StatsController";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App = () => {
  return (
    <div className="App">
      <StatsController />
    </div>
  );
};
