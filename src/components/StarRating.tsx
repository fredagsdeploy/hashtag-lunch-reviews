import React from "react";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";

interface StarProps {
  key: string;
  filled: number; // Star fills according to rules: empty < 0.25 <= half < 0.75 <= Full
}

const Star = ({ filled }: StarProps) => {
  if (0.75 <= filled) {
    return <YellowStar />;
  } else if (0.25 <= filled && filled < 0.75) {
    return <YellowHalfStar />;
  }
  return <YellowHollowStar />;
};

interface Props {
  rating: number;
  name: string;
}

export const StarRating = (props: Props) => {
  const rating = props.rating;

  return (
    <>
      {[0, 1, 2, 3, 4].map(i => (
        <Star key={`${i}`} filled={rating - i} />
      ))}
    </>
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
