import React, { useEffect } from "react";
import { getReviewsForPlace } from "../lib/backend";

interface Props {
  match: any;
}

export const PlaceController = ({ match }: Props) => {
  useEffect(() => {
    getReviewsForPlace(match.params.placeId)
      .then(resp => console.log(resp))
      .catch(err => console.log("err", err));
  }, []);

  return <div>{match.params.placeId}</div>;
};
