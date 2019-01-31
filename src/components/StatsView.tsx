import React from "react";
import { Rating } from "../types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

interface Props {
  ratings: Array<Rating>;
  headerClicked: Function;
}

export const StatsView = ({ ratings, headerClicked }: Props) => {
  const cells = ratings.map((rating, i) => {
    return (
      <>
        <Cell key={`name-${rating.name}`}>{rating.name}</Cell>
        <Cell key={`rating-${rating.name}`}>{rating.rating}</Cell>
        <Cell key={`comment-${rating.name}`}>{rating.comment}</Cell>

        <Cell key={`link-${rating.name}`}>
          {
            <a href={rating.google_maps_link}>
              <FontAwesome name="external-link" />
            </a>
          }
        </Cell>
      </>
    );
  });

  return (
    <>
      <GridContainer>
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
          key="comment-header-cell"
          onClick={() => headerClicked("comment")}
        >
          Comment
        </HeaderCell>
        <HeaderCell>Link</HeaderCell>
        {cells.map((c: any) => c)}
      </GridContainer>
    </>
  );
};

const Cell = styled.span`
  padding: 8px 4px;
  &:nth-child(8n + 9) {
    background: lightgrey;
  }
  &:nth-child(8n + 10) {
    background: lightgrey;
  }
  &:nth-child(8n + 11) {
    background: lightgrey;
  }
  &:nth-child(8n + 12) {
    background: lightgrey;
  }
`;

const HeaderCell = styled(Cell)`
  font-weight: bold;
  border-bottom: 2px solid black;
`;

const GridContainer = styled.div`
  display: grid;
  width: 50%;
  /* grid-auto-rows: 50px; */
  grid-template-columns: repeat(4, 1fr);

  /* grid-template-areas:
    "n r c"
    "n r c"; */
`;
