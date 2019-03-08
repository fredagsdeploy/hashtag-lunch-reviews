import React, { Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { App2 } from "./App2";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App = () => {
  return (
    <LayoutGrid className="App">
      <GlobalStyle />
      <Suspense fallback={<h1>Loading</h1>}>
        <App2 />
      </Suspense>
    </LayoutGrid>
  );
};

const LayoutGrid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 10% 1fr 10%;
  grid-template-rows: 5% 1fr 5%;
  grid-template-areas:
    "h h h"
    "c c c"
    "f f f";
  /* grid-template-columns: 1fr; */
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
