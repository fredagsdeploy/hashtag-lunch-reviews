import React, { ChangeEvent, useState } from "react";
import { PlaceView } from "./PlaceView";
import { RouteChildrenProps } from "react-router";
import { Review } from "../types";
import { useBoolean } from "../customHooks/useBoolean";
import { useUserContext } from "../customHooks/useUserContext";
import { postReview, getReviewsForPlace } from "../lib/backend";
import { browserHistory } from "../history";
import { unstable_createResource } from "react-cache";

interface Props extends RouteChildrenProps<{ placeId: string }> {}

const reviewsResource = unstable_createResource(getReviewsForPlace);

export const PlaceController = ({ match }: Props) => {
  if (!match) {
    return null;
  }
  const { placeId } = match.params;
  const reviewsFromServer = reviewsResource.read(placeId);
  const [reviews, setReviews] = useState(reviewsFromServer);

  const [isAddingReview, toggleIsAddingReview, setIsAddingReview] = useBoolean(
    false
  );

  const user = useUserContext();

  const newReviewInitalState: Partial<Review> = {
    rating: 0,
    comment: "",
    userId: user.id,
    placeId: placeId
  };

  const [newReview, setNewReview] = useState(newReviewInitalState);

  const addReview = () => {
    postReview(newReview)
      .then((response: { review: Review }) => {
        setNewReview(newReviewInitalState);
        setIsAddingReview(false);
        console.log("Added", response.review);
        setReviews([...reviews, response.review]);
      })
      .catch(e => {
        console.log("Couldn't post new place", e);
      });
  };

  const handleNewReviewInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.name) {
      throw new Error("No name on event.target");
    }
    console.log(event.target.name);
    console.log(event.target.value);
    setNewReview({ ...newReview, [event.target.name]: event.target.value });
  };

  return (
    <PlaceView
      placeId={placeId}
      reviews={reviews}
      addRowPressed={() => toggleIsAddingReview()}
      isAddingReview={isAddingReview}
      newReviewData={newReview}
      sumbitNewReview={addReview}
      newReviewDataChange={handleNewReviewInput}
    />
  );
};
