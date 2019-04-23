import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { Place, Rating } from "../types";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import { Button, LastCell, Row, WhiteRow } from "./CommonFormComponents";
import { PlaceRowView } from "./place/PlaceRowView";

interface Props {
  ratings: Array<Rating>;
  addRowPressed: () => void;
  newPlaceData: Partial<Place>;
  newPlaceDataChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isAddingPlace: boolean;
  submitNewPlace: () => void;
}

export const StatsView = ({
  ratings,
  addRowPressed,
  newPlaceData,
  newPlaceDataChange,
  isAddingPlace,
  submitNewPlace
}: Props) => {
  return (
    <>
      {!isAddingPlace && (
        <AddPlaceContainer>
          <Button onClick={addRowPressed}>Add new place</Button>
        </AddPlaceContainer>
      )}
      {isAddingPlace && (
        <>
          <h3>New place:</h3>
          <StatsContainerNoHover>
            <AddNewPlaceForm
              newPlaceDataChange={newPlaceDataChange}
              placeData={newPlaceData}
            />
          </StatsContainerNoHover>
          <WhiteRow>
            <LastCell>
              <div onClick={submitNewPlace}>OK</div>
              <div onClick={addRowPressed}>NEJ</div>
            </LastCell>
          </WhiteRow>
        </>
      )}
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

  @media screen and (max-width: 600px) {
    padding: 0 1em;
  }
`;

const StatsContainerNoHover = styled(Row)`
  display: grid;
  @media (min-width: 900px) {
    grid-template-columns: 15% 15% 45% auto;
    grid-template-areas: "rating normalized-rating comment comment link";
    padding: 2em 5em;
  }

  @media (max-width: 900px) {
    grid-template-columns: 25% 25% 25% auto;
    grid-template-rows: 50% auto;
    grid-template-areas:
      "rating rating normalized-rating normalized-rating"
      "comment comment comment link";
    padding: 2em 2em;
  }
  align-items: center;
`;

const AddPlaceContainer = styled.div`
  align-self: flex-end;
  padding-right: 10%;
  margin-top: 1em;
`;
