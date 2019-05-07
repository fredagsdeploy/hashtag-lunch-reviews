import React, { ChangeEventHandler, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Rating } from "../types";
import { PlaceRowView } from "./place/PlaceRowView";
import { SaveButton } from "./CommonFormComponents";
import { useDebounce } from "../customHooks/useDebounce";
import { StickySearchBar } from "./SearchBar";
import { browserHistory } from "../history";

interface Props {
  ratings: Array<Rating>;
}

export const StatsView = ({ ratings }: Props) => {
  const [searchString, setSearchString] = useState<string>("");
  const searchStringChange: ChangeEventHandler<HTMLInputElement> = event =>
    setSearchString(event.target.value);

  const debouncedSearchString = useDebounce(searchString, 100);

  const filteredRatings = useMemo(() => ratings.filter(rating =>
    rating.placeName.toLowerCase().includes(debouncedSearchString.toLowerCase())
  ), [debouncedSearchString, ratings]);

  return (
    <>
      <StickySearchBar
        value={searchString}
        setSearchString={searchStringChange}
      />
      {useMemo(
        () => (
          <RatingsListContainer>
            {filteredRatings.length === 0 ? (
              <NoSearchResult searchQuery={debouncedSearchString} />
            ) : (
              filteredRatings.map(rating => (
                <PlaceRowView
                  key={rating.placeId}
                  rating={rating}
                  placeId={rating.placeId}
                />
              ))
            )}
          </RatingsListContainer>
        ),
        [filteredRatings, debouncedSearchString]
      )}
    </>
  );
};

interface NoSearchResultProps {
  searchQuery: string;
}

const NoSearchResult = ({ searchQuery }: NoSearchResultProps) => {
  const navigateToCreatePlace = () => {
    browserHistory.push(`/ratings/newplace?placeName=${searchQuery}`);
  };

  return (
    <NoResultContainer>
      Inget plats vid namn "{searchQuery}". <br /> Vill du lägga till det? <br />
      <CreatePlaceButton onClick={() => navigateToCreatePlace()}>
        Skapa plats
      </CreatePlaceButton>
    </NoResultContainer>
  );
};

const CreatePlaceButton = styled(SaveButton)`
    margin-top: 1em;
`;

const NoResultContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const RatingsListContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(auto, 800px);
  grid-gap: 1em;
  margin-top: 5rem;
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
