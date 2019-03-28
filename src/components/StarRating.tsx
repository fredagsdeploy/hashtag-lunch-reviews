import React from "react";
import styled from "styled-components";
import _ from "lodash";

interface Props {
  rating: number;
}

export const StarRating = (props: Props) => {
  const rating = _.min([5, props.rating]) || 0;

  return (
    <>
      <StarDiv style={{ width: rating * 28 }} />
      <EmptyStarDiv style={{ width: 5 * 28 }} />
    </>
  );
};

const StarDiv = styled.div`
  background-image: url(/starsolid.svg);
  background-repeat: repeat-x;
  height: 28px;
  position: absolute;
  z-index: 1;
`;

const EmptyStarDiv = styled.div`
  background-image: url(/starhollow.svg);
  background-repeat: repeat-x;
  height: 28px;
  z-index: 0;
`;
