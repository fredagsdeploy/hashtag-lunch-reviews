import {
  faList,
  faMap,
  faPlus,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { useUserContext } from "../customHooks/useUserContext";

export const StatusBar = () => {
  const user = useUserContext()!;
  return (
    <Bar>
      <NavItem to={"/ratings"} activeClassName="active">
        <Column>
          <FontAwesomeIcon icon={faList} style={{ fontSize: "1.7rem" }} />
          Lista
        </Column>
      </NavItem>
      <NavItem to={"/map"} activeClassName="active">
        <Column>
          <FontAwesomeIcon icon={faMap} style={{ fontSize: "1.7rem" }} />
          Karta
        </Column>
      </NavItem>
      <NavItem to={"/ratings/newplace"} activeClassName="active">
        <Column>
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1.7rem" }} />
          Nytt
        </Column>
      </NavItem>
      <NavItem to={"/me"} activeClassName="active">
        <Column>
          <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.7rem" }} />
          {user.displayName}
        </Column>
      </NavItem>
    </Bar>
  );
};

const NavItem = styled(NavLink)`
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  width: 25%;

  &:hover {
    background-color: #fff2;
    cursor: pointer;
  }

  &.active {
    color: #002f7d;
    background-color: #fff2;
  }
`;

const Bar = styled.div`
  display: flex;
  background-color: cornflowerblue;
  justify-content: space-around;
  width: 100%;

  position: fixed;
  top: 0;
  z-index: 99;
  transition: padding-bottom  ease;

  @media screen and (max-width: 600px) {
    top: auto;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
