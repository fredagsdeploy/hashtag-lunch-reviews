import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import styled from "styled-components";
import { NavigationFooter } from "./components/NavigationFooter";
import { AddNewReviewForm } from "./components/review/AddNewReviewForm";

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
    <>
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
    </>
  );
};

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 800px);
  justify-content: center;
`;
