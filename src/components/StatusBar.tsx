import React from "react";
import styled from "styled-components";
import { useUserContext } from "../customHooks/useUserContext";
import { browserHistory } from "../history";

interface Props {
  logoutClicked: () => void;
}

export const StatusBar = ({ logoutClicked }: Props) => {
  const user = useUserContext();
  return (
    <Bar>
      <div>
        <NavItem onClick={() => browserHistory.push("/ratings")}>
          All Places
        </NavItem>
      </div>
      <div>
        <NavItem onClick={() => browserHistory.push("/me")}>User</NavItem>
        <NavItem onClick={logoutClicked}>Logout</NavItem>
        <Name> {user.givenName}</Name>
      </div>
    </Bar>
  );
};

const NavItem = styled.a`
  color: #fff;
  padding: 1em;
  text-decoration: none;
  &:hover {
    background-color: #9fbaec;
    cursor: pointer;
  }
`;

const Name = styled.div`
  padding: 1em;
  color: #ccc;
  display: inline;
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
