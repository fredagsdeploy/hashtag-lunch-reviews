import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Rating } from "../types";
import { PlaceRowView } from "./place/PlaceRowView";

interface Props {
  ratings: Array<Rating>;
}

export const StatsView = ({ ratings }: Props) => {
  return (
    <>
      <AddPlaceContainer>
        <Button to="/ratings/newplace">Add new place</Button>
      </AddPlaceContainer>
      <RatingsListContainer>
        {ratings.map(rating => (
          <PlaceRowView
            key={rating.placeId}
            rating={rating}
            placeId={rating.placeId}
          />
        ))}
      </RatingsListContainer>
    </>
  );
};

const RatingsListContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(auto, 800px);
  grid-gap: 1em;
`;

const AddPlaceContainer = styled.div`
  align-self: flex-end;
  padding-right: 10%;
  margin-top: 1em;
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
