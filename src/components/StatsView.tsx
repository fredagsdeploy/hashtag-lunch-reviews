import React, { ChangeEventHandler, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Rating } from "../types";
import { PlaceRowView } from "./place/PlaceRowView";
import { TextInput } from "./CommonFormComponents";
import { useDebounce } from "../customHooks/useDebounce";

interface Props {
  ratings: Array<Rating>;
}

export const StatsView = ({ ratings }: Props) => {
  const [searchString, setSearchString] = useState<string>("");
  const searchStringChange: ChangeEventHandler<HTMLInputElement> = event =>
    setSearchString(event.target.value);

  const debouncedSearchString = useDebounce(searchString, 100);

  return (
    <>
      <StickySearchBar
        placeholder="Sök..."
        name="searchString"
        value={searchString}
        onChange={searchStringChange}
      />
      {useMemo(
        () => (
          <RatingsListContainer>
            {ratings
              .filter(rating =>
                rating.placeName
                  .toLowerCase()
                  .includes(debouncedSearchString.toLowerCase())
              )
              .map(rating => (
                <PlaceRowView
                  key={rating.placeId}
                  rating={rating}
                  placeId={rating.placeId}
                />
              ))}
          </RatingsListContainer>
        ),
        [ratings, debouncedSearchString]
      )}
    </>
  );
};

const StickySearchBar = styled(TextInput)`
  position: sticky;
  top: 50px;
  z-index: 2;
  border-radius: 0;
`;

const RatingsListContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(auto, 800px);
  grid-gap: 1em;
`;

export const Button = styled(Link)`
  background-color: #fff;
  padding: 0.3em 1em;

  width: max-content;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
  border-radius: 24px;

  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
