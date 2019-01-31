import React from "react";
import { Rating } from "../types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

interface Props {
  ratings: Array<Rating>;
  headerClicked: Function;
}

export const StatsView = ({ ratings, headerClicked }: Props) => {
  const cells: any = [];
  ratings.forEach((rating, i) => {
    const Cell = i % 2 == 0 ? EvenCell : OddCell;
    cells.push(<Cell key={`name-${rating.name}`}>{rating.name}</Cell>);
    cells.push(<Cell key={`rating-${rating.name}`}>{rating.rating}</Cell>);
    cells.push(<Cell key={`comment-${rating.name}`}>{rating.comment}</Cell>);
    cells.push(
      <Cell key={`link-${rating.name}`}>
        {
          <a href={rating.google_maps_link}>
            <FontAwesome name="external-link" />
          </a>
        }
      </Cell>
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

const BaseCell = styled.span`
  padding: 8px 4px;
`;

const EvenCell = styled(BaseCell)``;

const OddCell = styled(BaseCell)`
  background: lightgrey;
`;

const HeaderCell = styled(BaseCell)`
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
