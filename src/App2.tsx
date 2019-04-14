import React, { useState } from "react";

import { StatsController } from "./components/StatsController";
import { StatusBar } from "./components/StatusBar";
import { NavigationFooter } from "./components/NavigationFooter";
import { browserHistory } from "./history";
import { Router, Route, Switch } from "react-router-dom";
import { UserController } from "./components/UserController";
import { useGoogleAuth } from "./useGoogleAuth";
import { GoogleUser, emptyUser } from "./types";
import { UserContext } from "./customHooks/useUserContext";
import styled from "styled-components";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App2: React.FC = () => {
  const [error, setError] = useState<Error | null | string>(null);
  const { googleUser, user, signOut, authorize } = useGoogleAuth();

  if (!googleUser || !user) {
    return (
      <>
        <h1>Authorise google to use this page.</h1>
        <input onClick={authorize} type="button" value="Authorize!" />
      </>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <Router history={browserHistory}>
        <>
          <StatusBar logoutClicked={signOut} />
          <ContentContainer>
            <Switch>
              <Route exact path="/" component={StatsController} />
              <Route exact path="/ratings" component={StatsController} />
              <Route exact path="/me" component={UserController} />
            </Switch>
          </ContentContainer>
        </>
      </Router>
      <NavigationFooter />
      {error && <h2>{error}</h2>}
    </UserContext.Provider>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
  flex: 1;
  background-color: #f6f8fa;
`;
