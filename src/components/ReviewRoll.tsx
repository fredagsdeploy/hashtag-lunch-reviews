import React from "react";
import { Review } from "../types";
import { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

interface Props {
  reviews: Array<Review>;
}

export const RollReviews = ({ reviews }: Props) => {
  const nonEmptyReviews = reviews.filter(
    v => v.comment !== undefined && v.comment !== ""
  );

  const emptyReview: Partial<Review> = {
    comment: ""
  };

  const [review, setReview] = useState(nonEmptyReviews[0] || emptyReview);

  let [i, setIndex] = useState(1);

  let [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const newReview = nonEmptyReviews[i] || emptyReview;

    console.log(newReview);
    let reviewTimeout = setTimeout(() => {
      setReview(newReview);
      setIndex((i + 1) % nonEmptyReviews.length);
      setOpacity(1);
      console.log("Update review");
    }, 5000);
    let opacityTimeout = setTimeout(() => {
      setOpacity(0);
    }, 4500);

    return () => {
      clearTimeout(reviewTimeout);
      clearTimeout(opacityTimeout);
    };
  }, [i]);

  return (
    <>
      {review.comment != "" && (
        <ReviewComment style={{ opacity: opacity }}>
          "{review.comment}"
        </ReviewComment>
      )}
    </>
  );
};

const ReviewComment = styled.div`
  flex: 1;
  text-align: end;
  transition: all 500ms;
  font-style: italic;
`;
