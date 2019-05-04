import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import styled from "styled-components";
import { NavigationFooter } from "./components/NavigationFooter";

import { StatsController } from "./components/StatsController";
import { StatusBar } from "./components/StatusBar";
import { UserController } from "./components/UserController";
import { browserHistory } from "./history";
import { useGoogleAuth } from "./useGoogleAuth";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App2: React.FC = () => {
  const { googleUser, user, authorize } = useGoogleAuth();

  if (!googleUser || !user) {
    return (
      <>
        <h1>Authorise google to use this page.</h1>
        <input onClick={authorize} type="button" value="Authorize!" />
      </>
    );
  }

  return (
    <>
      <Router history={browserHistory}>
        <>
          <StatusBar />
          <ContentContainer>
            <Switch>
              <Route path="/ratings" component={StatsController} />
              <Route exact path="/me" component={UserController} />
              <Route>
                <Redirect to="/ratings" />
              </Route>
            </Switch>
          </ContentContainer>
        </>
      </Router>
      <NavigationFooter />
    </>
  );
};

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 800px);
  justify-content: center;
`;
