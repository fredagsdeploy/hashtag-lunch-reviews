import React from "react";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import { Place, Rating } from "../types";
import { StarRating } from "./StarRating";

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

interface EditPlaceRowProps {
  placeData: Partial<Place>;
  newPlaceDataChange: Function;
}

const EditPlaceRow = ({ placeData, newPlaceDataChange }: EditPlaceRowProps) => {
  const { placeName, google_maps_link, comment } = placeData;
  if (
    placeName === undefined ||
    google_maps_link === undefined ||
    comment === undefined
  ) {
    throw new Error(
      `Missing members in place data ${JSON.stringify(placeData)}`
    );
  }

  return (
    <WhiteRow>
      <Cell />
      <Cell>
        <TextInput
          placeholder="Name"
          name="placeName"
          value={placeName}
          onChange={newPlaceDataChange}
        />
      </Cell>
      <Cell />
      <Cell />
      <Cell>
        <TextInput
          placeholder="Comment"
          name="comment"
          value={comment}
          onChange={newPlaceDataChange}
        />
      </Cell>
      <Cell>
        <TextInput
          placeholder="Link"
          name="google_maps_link"
          value={google_maps_link}
          onChange={newPlaceDataChange}
        />
      </Cell>
    </WhiteRow>
  );
};

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
  const rows = ratings.map((rating, i) => {
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
            <EditPlaceRow
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

const Cell = styled.td`
  padding: 8px 4px;
`;

const WhiteRow = styled.tr`
  background-color: white;
`;
const LastCell = styled.td`
  text-align: center;
`;

const StarCell = styled(Cell)`
  white-space: nowrap;
`;

const HeaderCell = styled.th`
  font-weight: bold;
  border-bottom: 2px solid black;
`;

const Table = styled.table`
  width: 50%;
  border-collapse: collapse;
  justify-self: center;
  grid-area: c;
`;

const Row = styled.tr`
  &:nth-child(2n + 3) {
    background-color: lightgrey;
  }
`;

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: any;
  name: string;
}
var TextInput = (props: TextInputProps) => {
  return <input {...props} type="text" />;
};

TextInput = styled.input`
  width: 100%;
`;
