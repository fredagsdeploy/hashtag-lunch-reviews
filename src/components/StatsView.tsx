import React from "react";
import { Place, Rating } from "../types";
import { StarRating } from "./StarRating";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import {
  Cell,
  LastCell,
  Row,
  StarCell,
  WhiteRow,
  Button
} from "./CommonFormComponents";
import styled from "styled-components";
import { PlaceRowView } from "./place/PlaceRowView";

interface Props {
  ratings: Array<Rating>;
  headerClicked: Function;
  addRowPressed: Function;
  newPlaceData: Partial<Place>;
  newPlaceDataChange: Function;
  isAddingPlace: boolean;
  sumbitNewPlace: Function;
  placeClicked: Function;
}

export const StatsView = ({
  ratings,
  headerClicked,
  addRowPressed,
  newPlaceData,
  newPlaceDataChange,
  isAddingPlace,
  sumbitNewPlace,
  placeClicked
}: Props) => {
  const rows = ratings.map(rating => {
    return (
      <>
        <PlaceRowView placeId={rating.placeId} />
      </>
    );
  });

  return (
    <>
      {!isAddingPlace && (
        <AddPlaceContainer>
          <Button onClick={() => addRowPressed()}>Add new place</Button>
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
              <div onClick={() => sumbitNewPlace()}>OK</div>
              <div onClick={() => addRowPressed()}>NEJ</div>
            </LastCell>
          </WhiteRow>
        </>
      )}
      {rows[0]}
    </>
  );
};

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

const StatsContainer = styled(StatsContainerNoHover)`
  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const Header = styled.span`
  margin-bottom: -0.5em;
  width: 60%;
  font-weight: 500;
  color: #333;
  margin-top: 2em;
  ${StatsContainer}:hover & {
    color: #00f;
  }
`;

const AddPlaceContainer = styled.div`
  align-self: flex-end;
  padding-right: 10%;
  margin-top: 1em;
`;
