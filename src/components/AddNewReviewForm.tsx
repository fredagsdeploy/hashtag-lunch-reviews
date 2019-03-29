import React from "react";
import { Review } from "../types";
import { Cell, TextInput, WhiteRow } from "./CommonFormComponents";
import styled from "styled-components";
import { StarRating } from "./StarRating";

interface EditReviewRowProps {
  reviewData: Partial<Review>;
  newReviewDataChange: Function;
}

export const AddNewReviewForm = ({
  reviewData,
  newReviewDataChange
}: EditReviewRowProps) => {
  const { rating, comment } = reviewData;
  if (rating === undefined || comment === undefined) {
    throw new Error(
      `Missing members in review data ${JSON.stringify(reviewData)}`
    );
  }

  return (
    <>
      <Cell style={{ gridArea: "name" }}>Todo</Cell>
      <Cell style={{ gridArea: "rating" }}>
        <StarInput
          placeholder="Rating"
          name="rating"
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={rating}
          onChange={newReviewDataChange}
        />
        <StarRating rating={rating} />
      </Cell>
      <Cell style={{ gridArea: "comment" }}>
        <TextInput
          placeholder="Comment"
          name="comment"
          value={comment}
          onChange={newReviewDataChange}
        />
      </Cell>
    </>
  );
};

interface InputProps {
  onChange: any;
}

const StarInput = styled.input<InputProps>`
  width: 140px;
  height: 28px
  z-index: 2;
  opacity: 0;
  position: absolute;
`;
