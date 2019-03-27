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
      <Row
        key={rating.placeId}
        onClick={() => {
          placeClicked(rating);
        }}
      >
        <Cell>{rating.rank}</Cell>
        <Cell>{rating.placeName}</Cell>
        <StarCell>
          <StarRating
            name={`rating-a-${rating.placeName}`}
            rating={rating.rating}
          />
        </StarCell>
        <StarCell>
          <StarRating
            name={`rating-a-${rating.placeName}`}
            rating={rating.normalized_rating}
          />
        </StarCell>
        <Cell>{rating.comment}</Cell>

        <Cell>
          {
            <a href={rating.google_maps_link}>
              <FontAwesome name="external-link" />
            </a>
          }
        </Cell>
      </Row>
    );
  });

  return (
    <Table>
      <tbody>
        <Row>
          <HeaderCell>Rank</HeaderCell>
          <HeaderCell onClick={() => headerClicked("name")}>Name</HeaderCell>
          <HeaderCell onClick={() => headerClicked("rating")}>
            Rating
          </HeaderCell>
          <HeaderCell onClick={() => headerClicked("normalized_rating")}>
            Normalized Rating
          </HeaderCell>
          <HeaderCell onClick={() => headerClicked("comment")}>
            Comment
          </HeaderCell>
          <HeaderCell>Link</HeaderCell>
        </Row>
        {rows}

        <WhiteRow>
          <LastCell colSpan={100}>
            <FontAwesome
              name="plus"
              size="2x"
              onClick={() => addRowPressed()}
            />
          </LastCell>
        </WhiteRow>
        {isAddingPlace && (
          <>
            <AddNewPlaceForm
              newPlaceDataChange={newPlaceDataChange}
              placeData={newPlaceData}
            />
            <WhiteRow>
              <LastCell colSpan={100}>
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
      </tbody>
    </Table>
  );
};
