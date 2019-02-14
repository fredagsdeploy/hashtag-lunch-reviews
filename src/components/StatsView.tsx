import React from "react";
import { Rating } from "../types";
import styled from "styled-components";
import { StarRating } from "./StarRating";
import FontAwesome from "react-fontawesome";

interface Props {
  ratings: Array<Rating>;
  headerClicked: Function;
}

export const StatsView = ({ ratings, headerClicked }: Props) => {
  const cells = ratings.map((rating, i) => {
    return (
      <Row>
        <Cell key={`name-${rating.name}`}>{rating.name}</Cell>
        <StarCell key={`rating-${rating.name}`}>
          <StarRating name={`rating-a-${rating.name}`} rating={rating.rating} />
        </StarCell>
        <StarCell key={`normalized-rating-${rating.name}`}>
          <StarRating
            name={`rating-a-${rating.name}`}
            rating={rating.normalized_rating}
          />
        </StarCell>
        <Cell key={`comment-${rating.name}`}>{rating.comment}</Cell>

        <Cell key={`link-${rating.name}`}>
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
    <>
      <GridContainer>
        <Row>
          <HeaderCell
            key="name-header-cell"
            onClick={() => headerClicked("name")}
          >
            Name
          </HeaderCell>
          <HeaderCell
            key="rating-header-cell"
            onClick={() => headerClicked("rating")}
          >
            Rating
          </HeaderCell>
          <HeaderCell
            key="normalized-rating-header-cell"
            onClick={() => headerClicked("normalized_rating")}
          >
            Normalized Rating
          </HeaderCell>
          <HeaderCell
            key="comment-header-cell"
            onClick={() => headerClicked("comment")}
          >
            Comment
          </HeaderCell>
          <HeaderCell>Link</HeaderCell>
        </Row>
        {cells}
      </GridContainer>
    </>
  );
};

const Cell = styled.td`
  padding: 8px 4px;
`;

const StarCell = styled(Cell)`
  white-space: nowrap;
`;

const HeaderCell = styled.th`
  font-weight: bold;
  border-bottom: 2px solid black;
`;

const GridContainer = styled.table`
  width: 50%;
  border-collapse: collapse;
`;

const Row = styled.tr`
  &:nth-child(2n + 3) {
    background-color: lightgrey;
  }
`;
