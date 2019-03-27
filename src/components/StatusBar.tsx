import React from "react";
import styled from "styled-components";
import { useUserContext } from "../customHooks/useUserContext";

interface Props {
  logoutClicked: () => void;
}

export const StatusBar = ({ logoutClicked }: Props) => {
  const user = useUserContext();
  return (
    <Bar>
      Welcome {user.givenName}
      <LogoutButton type="button" value="Logout" onClick={logoutClicked} />
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  padding: 1em;
  background-color: cornflowerblue;
  align-items: center;
  margin-bottom: 0.5em;
  width: 100%;
`;

const LogoutButton = styled.input`
  margin-left: auto;
  flex: flex-end;
`;
