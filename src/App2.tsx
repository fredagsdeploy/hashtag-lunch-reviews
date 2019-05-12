import React, { Suspense } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import styled from "styled-components";
import { MapPage } from "./components/MapPage";
import { NavigationFooter } from "./components/NavigationFooter";
import { Spinner } from "./components/Spinner";

import { StatsController } from "./components/StatsController";
import { StatusBar } from "./components/StatusBar";
import { UserController } from "./components/UserController";
import { browserHistory } from "./history";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const App2: React.FC = () => {
  return (
    <>
      <Router history={browserHistory}>
        <>
          <StatusBar />
          <Suspense fallback={<Spinner size={"large"} />}>
            <ContentContainer>
              <Switch>
                <Route path="/ratings" component={StatsController} />
                <Route path="/map" component={MapPage} />
                <Route exact path="/me" component={UserController} />
                <Route>
                  <Redirect to="/ratings" />
                </Route>
              </Switch>
            </ContentContainer>
          </Suspense>
        </>
      </Router>
      <NavigationFooter />
    </>
  );
};

const ContentContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(auto, 800px);
  justify-content: center;
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);

  align-items: flex-start;
  align-content: flex-start;
`;
