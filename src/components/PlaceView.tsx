import React from "react";
import { Review } from "../types";
import { Cell, HeaderCell, Row, Table } from "./CommonFormComponents";
import { unstable_createResource } from "react-cache";
import { getPlaceById, getReviewsForPlace } from "../lib/backend";

const placeResource = unstable_createResource(getPlaceById);
const reviewsResource = unstable_createResource(getReviewsForPlace);

export const PlaceView = ({ placeId }: { placeId: string }) => {
  const place = placeResource.read(placeId);
  const reviews = reviewsResource.read(placeId);

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
              <Cell>Todo</Cell>{" "}
              {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
              <Cell>{r.rating}</Cell>
              <Cell>{r.comment}</Cell>
            </Row>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
