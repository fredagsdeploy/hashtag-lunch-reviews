import React from "react";
import { Review } from "../types";
import {
  Cell,
  HeaderCell,
  Row,
  Table,
  WhiteRow,
  LastCell
} from "./CommonFormComponents";
import { unstable_createResource } from "react-cache";
import { getPlaceById } from "../lib/backend";
import { AddNewReviewForm } from "./AddNewReviewForm";
import FontAwesome from "react-fontawesome";

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
    <div>
      <h2>{place.placeName}</h2>
      <Table>
        <tbody>
          <Row>
            <HeaderCell>Vem</HeaderCell>
            <HeaderCell>Rating</HeaderCell>
            <HeaderCell>Comment</HeaderCell>
          </Row>
          {reviews.map((r: Review) => (
            <Row key={r.reviewId}>
              <Cell>Todo</Cell>
              {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
              <Cell>{r.rating}</Cell>
              <Cell>{r.comment}</Cell>
            </Row>
          ))}
          {!isAddingReview && (
            <WhiteRow>
              <LastCell colSpan={100}>
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
                <LastCell colSpan={100}>
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
        </tbody>
      </Table>
    </div>
  );
};
