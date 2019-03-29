import React from "react";
import styled from "styled-components";
import _ from "lodash";

interface Props {
  rating: number;
}

export const StarRating = (props: Props) => {
  const starSize = 16;
  const rating = _.min([5, props.rating]) || 0;

  return (
    <>
      <StarDiv style={{ width: rating * starSize }} />
      <HollowStarDiv style={{ width: 5 * starSize }} />
    </>
  );
};

const StarDiv = styled.div`
  background-image: url(/starsolid.svg);
  background-repeat: repeat-x;
  background-size: 16px;
  height: 16px;
  position: absolute;
  z-index: 1;
`;

const HollowStarDiv = styled.div`
  background-image: url(/starhollow.svg);
  background-size: 16px;
  background-repeat: repeat-x;
  height: 16px;
  z-index: 0;
`;
