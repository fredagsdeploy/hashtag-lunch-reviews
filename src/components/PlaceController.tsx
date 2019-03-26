import React, {Suspense, useEffect, useState} from "react";
import {getPlaceById, getReviewsForPlace} from "../lib/backend";
import {PlaceView} from "./PlaceView";
import {newPlace, Place, Review} from "../types";

interface Props {
  match: any;
}

export const PlaceController = ({match}: Props) => {
  const [place, setPlace] = useState<Place>(newPlace);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getPlaceById(match.params.placeId)
      .then(p => setPlace(p))
      .catch(err => console.log("err", err));
  }, []);

  useEffect(() => {
    getReviewsForPlace(match.params.placeId)
      .then(r => setReviews(r))
      .catch(err => console.log("err", err));
  }, []);

  return <Suspense fallback={"Loading..."}>
    <PlaceView reviews={reviews} place={place}/>
  </Suspense>;
};
