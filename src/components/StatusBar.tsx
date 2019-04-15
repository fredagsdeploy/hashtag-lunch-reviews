import React from "react";
import styled from "styled-components";
import { useUserContext } from "../customHooks/useUserContext";
import { Link } from "react-router-dom";

interface Props {
  logoutClicked: () => void;
}

export const StatusBar = ({ logoutClicked }: Props) => {
  const user = useUserContext();
  return (
    <Bar>
      <div>
        <NavItem to={"/ratings"}>All Places</NavItem>
      </div>
      <div>
        <NavItem to={"/me"}>User</NavItem>
        <NavItem to={"/"} onClick={logoutClicked}>
          Logout
        </NavItem>
        <Name>{user.displayName}</Name>
      </div>
    </Bar>
  );
};

const NavItem = styled(Link)`
  color: #fff;
  padding: 0 0.8em 0 0;
  text-decoration: none;

  &:hover {
    background-color: #fff2;
    cursor: pointer;
  }
  &:first-child {
    padding-left: 0.8em;
  }
`;

const Name = styled.span`
  padding: 0 0.8em 0 0;
  color: #ccc;
`;

const Bar = styled.div`
  display: flex;
  background-color: cornflowerblue;
  justify-content: space-between;
  width: 100%;
  padding: 1em 0em;

  position: sticky;
  top: 0;
  z-index: 99;
`;
