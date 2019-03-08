import React from "react";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "../history";

export const NavigationFooter = () => {
  return (
    <Footer>
      <NavItem name="table" onClick={() => browserHistory.push("/ratings")} />
      <LastNavItem name="user" onClick={() => browserHistory.push("/me")} />
    </Footer>
  );
};

const Footer = styled.div`
  display: flex;
  grid-area: f;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
`;

const NavItem = styled(FontAwesome)`
  border-left: 1px solid black;
  height: 100%;
  width: 3em;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.4;
  }
`;

const LastNavItem = styled(NavItem)`
  border-right: 1px solid black;
`;
