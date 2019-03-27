import React from "react";
import FontAwesome from "react-fontawesome";
import { Place, Rating } from "../types";
import { StarRating } from "./StarRating";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import {
  Cell,
  HeaderCell,
  LastCell,
  Row,
  StarCell,
  Table,
  WhiteRow
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
      <StatsContainer
        key={rating.placeId}
        onClick={() => {
          placeClicked(rating);
        }}
      >
        <Cell style={{ gridArea: "name" }}>{rating.placeName}</Cell>
        <StarCell style={{ gridArea: "rating" }}>
          <StarRating rating={rating.rating} />
        </StarCell>
        <StarCell style={{ gridArea: "normalized-rating" }}>
          <StarRating rating={rating.normalized_rating} />
        </StarCell>
        <Cell style={{ gridArea: "comment" }}>{rating.comment}</Cell>

        <LastCell style={{ gridArea: "link" }}>
          {
            <a href={rating.google_maps_link}>
              <FontAwesome name="external-link" />
            </a>
          }
        </LastCell>
      </StatsContainer>
    );
  });

  return (
    <>
      {rows}

      <WhiteRow>
        <LastCell>
          <FontAwesome name="plus" size="2x" onClick={() => addRowPressed()} />
        </LastCell>
      </WhiteRow>
      {isAddingPlace && (
        <>
          <AddNewPlaceForm
            newPlaceDataChange={newPlaceDataChange}
            placeData={newPlaceData}
          />
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
    </>
  );
};

const StatsContainer = styled(Row)`
  display: grid;
  @media (min-width: 900px) {
    grid-template-columns: 16% 15% 15% 50% auto;
    grid-template-areas: "name rating normalized-rating comment comment link";
    padding: 2em 5em;
  }

  @media (max-width: 900px) {
    grid-template-columns: auto 30% 30%;
    grid-template-rows: 50% auto;
    grid-template-areas:
      "name rating normalized-rating"
      "comment comment link";
    padding: 2em 2em;
  }
  align-items: center;

  &:hover {
    background-color: #ccc;
    cursor: pointer;
  }
`;
