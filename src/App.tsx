import React, { Suspense } from "react";
import { Provider } from "react-redux";
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";

import { Spinner } from "./components/Spinner";
import { store } from "./store/configureStore";
import { browserHistory } from "./history";
import { Router, Switch, Route, Redirect } from "react-router";
import { StatusBar } from "./components/StatusBar";
import { MapPage } from "./components/MapPage";
import { StatsController } from "./components/StatsController";
import { UserController } from "./components/UserController";
import { NavigationFooter } from "./components/NavigationFooter";
import config from "./config";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

Modal.setAppElement("#root");

export const App = () => {
  Object.entries(config).forEach(entry => {
    if (!entry[1]) {
      console.log(`Unset environment ${entry[0]}`);
    }
  });

  return (
    <Provider store={store}>
      <LayoutGrid className="App">
        <GlobalStyle />
        <Suspense fallback={<Spinner size={"large"} />}>
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
        </Suspense>
      </LayoutGrid>
    </Provider>
  );
};

const LayoutGrid = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100%;

  padding-top: 70px;

  @media screen and (max-width: 600px) {
    padding-top: 0;
    padding-bottom: 70px;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: #f6f8fa;
  }

  body.modal-open {
    overflow: hidden;
  }

  html, #root, body {
    height: 100%;
    color: #5d5d5d;
    font-family: 'Roboto', sans-serif;
  }

  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

`;

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
