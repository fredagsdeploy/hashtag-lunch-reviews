import React from "react";
import {Place, Review} from "../types";
import {Cell, HeaderCell, Row, Table} from "./CommonFormComponents";

export const PlaceView = (props: { place: Place, reviews: Review[] }) => {

  const {place, reviews} = props;

  return <div>
    <h2>{place.placeName}</h2>
    <Table>
      <tbody>
      <Row>
        <HeaderCell>Vem</HeaderCell>
        <HeaderCell>Rating</HeaderCell>
        <HeaderCell>Comment</HeaderCell>
      </Row>
      {reviews.map((r: Review) =>
          <Row key={r.reviewId}>
            <Cell>Todo</Cell> {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
            <Cell>{r.rating}</Cell>
            <Cell>{r.comment}</Cell>
          </Row>
      )}
      </tbody>
    </Table>


  </div>;
}