import React, { ChangeEventHandler } from "react";
import styled from "styled-components";
import { TextInput } from "./CommonFormComponents";

interface Props {
  setSearchString: ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export const StickySearchBar: React.FC<Props> = ({
  setSearchString,
  ...props
}) => {
  return (
    <SearchBarContainer>
      <SearchInput
        placeholder="Sök..."
        name="searchString"
        {...props}
        type="search"
        onChange={setSearchString}
      />
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #edeced;
`;

const SearchInput = styled(TextInput)`
  position: sticky;
  top: 70px;
  z-index: 2;
  border-radius: 0;

  @media screen and (max-width: 600px) {
    top: 0;
  }
`;