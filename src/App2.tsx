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
import { AddNewReviewForm } from "./components/review/AddNewReviewForm";

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

  const goBack = () => {
    // This doesn't work but I couldn't figure it out
    browserHistory.push("/");
  };

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
              <Route
                path="/newreview/:placeId"
                render={props => (
                  <AddNewReviewForm {...props} onClose={goBack} />
                )}
              />
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
  display: grid;
  grid-template-columns: minmax(auto, 800px);
  justify-content: center;
`;
