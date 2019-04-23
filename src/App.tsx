import React, { Suspense } from "react";
import { Provider } from 'react-redux'
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";
import { App2 } from "./App2";
import { Spinner } from "./components/Spinner";
import { store } from "./store/configureStore";

declare global {
  interface Window {
    gapi: any;
  }
}

Modal.setAppElement("#root");

export const App = () => {
  return (
    <Provider store={store}>
      <LayoutGrid className="App">
        <GlobalStyle />
        <Suspense fallback={<Spinner size={"large"} />}>
          <App2 />
        </Suspense>
      </LayoutGrid>
    </Provider>
  );
};

const LayoutGrid = styled.div`
  display: flex;
  flex-flow: column;
  background-color: #f6f8fa;
  min-height: 100%;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
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
