import React from "react";

import StatsController from "./components/statsController";

declare global {
  interface Window {
    gapi: any;
  }
}

export default () => {
  return (
    <div className="App">
      <StatsController />
    </div>
  );
};
