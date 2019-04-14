import React from "react";
import FontAwesome from "react-fontawesome";
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
        <Header>{rating.placeName}</Header>
        <StatsContainer
          key={rating.placeId}
          onClick={() => {
            placeClicked(rating);
          }}
        >
          <StarCell style={{ gridArea: "rating" }}>
            <StarRating rating={rating.rating} />
          </StarCell>
          <StarCell style={{ gridArea: "normalized-rating" }}>
            <StarRating rating={rating.normalized_rating} />
          </StarCell>
          <Cell style={{ gridArea: "comment" }}>{rating.comment}</Cell>

          {rating.googlePlace && (
            <LastCell style={{ gridArea: "link" }}>
              {
                <a href={rating.googlePlace.url}>
                  <FontAwesome name="external-link" />
                </a>
              }
            </LastCell>
          )}
        </StatsContainer>
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
              <FontAwesome
                name="check"
                size="2x"
                onClick={() => sumbitNewPlace()}
              />
              <FontAwesome
                name="times"
                size="2x"
                onClick={() => addRowPressed()}
              />
            </LastCell>
          </WhiteRow>
        </>
      )}
      {rows}
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
