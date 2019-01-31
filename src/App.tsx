import React from "react";

import StatsController from "./components/StatsController";

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
