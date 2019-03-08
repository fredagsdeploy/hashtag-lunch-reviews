import React from "react";
import styled from "styled-components";
import { User } from "../types";

interface Props {
  user: User;
  logoutClicked: () => void;
}

export const StatusBar = ({ user, logoutClicked }: Props) => {
  return (
    <Bar>
      Welcome {user.givenName}
      <LogoutButton type="button" value="Logout" onClick={logoutClicked} />
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  padding: 0.5em;
  background-color: cornflowerblue;
  align-items: center;
  margin-bottom: 0.5em;
  grid-area: h;
`;

const LogoutButton = styled.input`
  margin-left: auto;
  flex: flex-end;
`;
