import React from "react";
import styled from "styled-components";
import _ from "lodash";
import star from "../images/star-solid.svg";
import hollowStar from "../images/star-regular.svg";

interface Props {
  rating: number;
}
const starSize = 16;

export const StarRating = (props: Props) => {
  const rating = _.min([5, props.rating]) || 0;

  return (
    <>
      <StarDiv style={{ width: rating * starSize }} />
      <HollowStarDiv style={{ width: 5 * starSize }} />
    </>
  );
};

const Star = styled.div`
  background-repeat: repeat-x;
  background-size: ${starSize}px;
  height: ${starSize}px;
  position: absolute;
  color: #f8c51c;
`;

const StarDiv = styled(Star)`
  background-image: url(${star});
  z-index: 1;
`;

const HollowStarDiv = styled(Star)`
  background-image: url(${hollowStar});
  z-index: 0;
`;
