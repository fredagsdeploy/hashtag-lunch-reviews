import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { putUser } from "../lib/backend";
import { updateUser } from "../store/reducers/user";
import {
  Label,
  FormLabelWrapper,
  SaveButton,
  TextInput
} from "./CommonFormComponents";
import { useGoogleAuth } from "../customHooks/useGoogleAuth";
import { useUserContext } from "../customHooks/useUserContext";

import styled from "styled-components";
export const UserController = () => {
  const user = useUserContext();

  return user ? <LoggedIn /> : <NotLoggedIn />;
};

const LoggedIn = () => {
  const user = useUserContext()!;
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState(user ? user.displayName : "");

  const saveUser = () => {
    putUser({ ...user, displayName }).then(updatedUser => {
      dispatch(updateUser(updatedUser));
    });
  };

  return (
    <Container>
      <Image src={user.imageUrl} alt="User" />
      <FormLabelWrapper>
        <Label>Namn</Label>
        <UserNameField
          placeholder="Namn"
          name="displayName"
          value={displayName || ""}
          onChange={(e: any) => setDisplayName(e.target.value)}
        />
      </FormLabelWrapper>
      <SaveUserButton onClick={saveUser}>Spara</SaveUserButton>
    </Container>
  );
};

const NotLoggedIn = () => {
  const { authorize } = useGoogleAuth();
  return (
    <>
      <h1>Logga in med google för att använda sidan</h1>
      <SaveButton onClick={authorize}>Logga in med google</SaveButton>
    </>
  );
};

const Image = styled.img`
  margin: 1rem 0;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
`;

const UserNameField = styled(TextInput)`
  width: 100%;
  max-width: 24em;
`;

const SaveUserButton = styled(SaveButton)`
  margin-top: 1em;
  width: 100%;
  max-width: 24em;
`;

const Container = styled.div`
  margin: 1em;
`;
