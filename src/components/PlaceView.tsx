import React from "react";
import { Review } from "../types";
import {
  Cell,
  HeaderCell,
  Row,
  Table,
  WhiteRow,
  LastCell,
  StarCell
} from "./CommonFormComponents";
import { unstable_createResource } from "react-cache";
import { getPlaceById } from "../lib/backend";
import { AddNewReviewForm } from "./AddNewReviewForm";
import FontAwesome from "react-fontawesome";
import { StarRating } from "./StarRating";
import styled from "styled-components";

const placeResource = unstable_createResource(getPlaceById);

interface Props {
  placeId: string;
  reviews: Array<Review>;
  isAddingReview: boolean;
  newReviewData: Partial<Review>;
  sumbitNewReview: Function;
  newReviewDataChange: Function;
  addRowPressed: Function;
}

export const PlaceView = ({
  placeId,
  reviews,
  isAddingReview,
  newReviewData,
  sumbitNewReview,
  newReviewDataChange,
  addRowPressed
}: Props) => {
  const place = placeResource.read(placeId);

  return (
    <>
      <h2>{place.placeName}</h2>
      {reviews.map((r: Review) => (
        <PlaceRow key={r.reviewId}>
          <Cell style={{ gridArea: "name" }}>Todo</Cell>
          {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
          <StarCell style={{ gridArea: "rating" }}>
            <StarRating rating={r.rating} />
          </StarCell>
          <Cell style={{ gridArea: "comment" }}>{r.comment}</Cell>
        </PlaceRow>
      ))}
      {!isAddingReview && (
        <WhiteRow>
          <LastCell>
            <FontAwesome
              name="plus"
              size="2x"
              onClick={() => addRowPressed()}
            />
          </LastCell>
        </WhiteRow>
      )}
      {isAddingReview && (
        <>
          <AddNewReviewForm
            reviewData={newReviewData}
            newReviewDataChange={newReviewDataChange}
          />
          <WhiteRow>
            <LastCell>
              <FontAwesome
                name="check"
                size="2x"
                onClick={() => sumbitNewReview()}
              />
              <FontAwesome
                name="times"
                size="2x"
                onClick={() => addRowPressed()}
              />
            </LastCell>
          </WhiteRow>
        </>
      )}
    </>
  );
};

const PlaceRow = styled(Row)`
  display: grid;

  grid-template-columns: 20% 20% auto;
  grid-template-areas: "name rating comment";
  padding: 1em 5em;

  align-items: center;
`;
