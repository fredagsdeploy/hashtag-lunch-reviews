import React from "react";
import { Review } from "../types";
import { Cell, TextInput, WhiteRow, NumberInput } from "./CommonFormComponents";

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
        <NumberInput
          placeholder="Rating"
          name="rating"
          value={rating}
          onChange={newReviewDataChange}
        />
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
