import React, { ChangeEventHandler } from "react";
import styled from "styled-components";
import { TextInput } from "./CommonFormComponents";
import { useHideOnScrollDown } from "../customHooks/useHideOnScrollDown";

interface Props {
  setSearchString: ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export const StickySearchBar: React.FC<Props> = ({
  setSearchString,
  ...props
}) => {
  const hide = useHideOnScrollDown();

  return (
    <SearchBarContainer hide={hide}>
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

const SearchBarContainer = styled.div<{ hide: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  z-index: 2;
  width: 100%;

  @media screen and (max-width: 600px) {
    top: 0;
  }

  top: ${props => (props.hide ? "-70px" : "70px")};
  transition: top 300ms;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(auto, 800px);
`;

const SearchInput = styled(TextInput)`
  border-radius: 8px;
  background: #fff;
  color: #333;
  margin-top: 1em;
  border: solid 2px #ccc;
`;
