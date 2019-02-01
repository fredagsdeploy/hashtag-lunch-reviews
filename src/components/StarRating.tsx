import React from "react";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";

const getStarForIterationAndRating = (
  starNumber: number,
  starRating: number
) => {
  const starDiff = Math.abs(starRating - starNumber);
  if (starNumber <= Math.floor(starRating)) {
    return <YellowStar />;
  } else if (0.25 <= starDiff && starDiff < 0.75) {
    return <YellowHalfStar />;
  }
  return <YellowHollowStar />;
};

const starRound = (rating: number): number => {
  if (rating == NaN) {
    return 0;
  }
  const decimalPart = rating - Math.floor(rating);
  if (decimalPart < 0.25) {
    return Math.floor(rating);
  } else if (decimalPart < 0.75) {
    return rating;
  } else {
    return Math.ceil(rating);
  }
};

interface Props {
  rating: number;
  name: string;
}

export const StarRating = (props: Props) => {
  const rating = props.rating;
  const starRating = starRound(rating);
  console.log(props.name, rating);

  return (
    <>{[1, 2, 3, 4, 5].map(i => getStarForIterationAndRating(i, rating))}</>
  );
};

const HalfGreyStar = (props: any) => (
  <FontAwesome {...props} name="star-half-o" />
);

const YellowHalfStar = styled(HalfGreyStar)`
  color: rgb(255, 180, 0);
`;

const GreyStar = (props: any) => <FontAwesome {...props} name="star" />;
const YellowStar = styled(GreyStar)`
  color: rgb(255, 180, 0);
`;

const HollowStar = (props: any) => <FontAwesome {...props} name="star-o" />;
const YellowHollowStar = styled(HollowStar)`
  color: rgb(255, 180, 0);
`;
