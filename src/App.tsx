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
  display: flex;
  flex-flow: column;
  align-items: center;
  background-color: #f6f8fa;
  min-height: 100%;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  html, #root, body {
    min-height: 100%;
  }

`;
