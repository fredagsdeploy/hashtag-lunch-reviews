import React from "react";
import { Review } from "../types";
import { Cell, TextInput, WhiteRow, RangeInput } from "./CommonFormComponents";
import styled from "styled-components";

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
    <WhiteRow>
      <Cell />
      <Cell>
        <StarDiv
          style={{ opacity: 0.4, position: "absolute", width: 5 * 28 }}
        />
        <StarDiv style={{ width: rating * 28 }} />
        <RangeInput
          placeholder="Rating"
          name="rating"
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={rating}
          onChange={newReviewDataChange}
        />
      </Cell>
      <Cell>
        <TextInput
          placeholder="Comment"
          name="comment"
          value={comment}
          onChange={newReviewDataChange}
        />
      </Cell>
    </WhiteRow>
  );
};

const StarDiv = styled.div`
  background-image: url(https://mdn.mozillademos.org/files/12005/starsolid.gif);
  background-repeat: repeat-x;
  height: 28px;
`;
