import React, { FormEvent, useState, ChangeEvent } from "react";
import { NewReview } from "../../types";
import styled from "styled-components";
import { StarRating } from "../StarRating";
import { useUserContext } from "../../customHooks/useUserContext";
import { postReview } from "../../lib/backend";
import { RouteChildrenProps } from "react-router";
import { usePlaceById } from "../../customHooks/api";

interface Props
  extends RouteChildrenProps<{
    placeId: string;
  }> {
  onClose: () => void;
}

export const AddNewReviewForm = ({ match, onClose }: Props) => {
  if (!match) {
    throw new Error("No such place");
  }
  const { placeId } = match.params;
  const place = usePlaceById(placeId);

  const user = useUserContext();
  const newReviewInitalState: NewReview = {
    rating: 0,
    comment: "",
    userId: user.googleUserId,
    placeId: placeId
  };

  const [newReview, setNewReview] = useState(newReviewInitalState);

  const addReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postReview(newReview)
      .then(() => {
        onClose();
      })
      .catch(e => {
        console.log("Couldn't post new review", e);
      });
  };

  const handleNewReviewInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!event.target.name) {
      throw new Error("No name on event.target");
    }
    const { name, value } = event.target;
    setNewReview(newReview => ({
      ...newReview,
      [name]: value
    }));
  };

  const ratingChangeHandler = (rating: number) => {
    setNewReview(newReview => ({
      ...newReview,
      rating
    }));
  };

  return (
    <CommentForm onSubmit={addReview}>
      <PlaceName>{place.placeName}</PlaceName>
      {place.comment && <PlaceComment>{place.comment}</PlaceComment>}
      <StarRating
        rating={newReview.rating}
        onChange={ratingChangeHandler}
        defaultSize={48}
        mobileSize={48}
      />
      <Comment>
        <CommentInput
          rows={14}
          cols={30}
          value={newReview.comment}
          placeholder={"Lägg till kommentar"}
          name={"comment"}
          onChange={handleNewReviewInput}
        />
      </Comment>
      <SaveButton>Spara</SaveButton>
    </CommentForm>
  );
};

const Comment = styled.div`
  /* white-space: nowrap; */

  overflow: hidden;
  text-overflow: ellipsis;

  color: #5d5d5d;
  font-style: italic;

  flex: 1;
  background-color: #efefef;

  border-radius: 4px;
  margin-bottom: 1em;
`;

const CommentInput = styled.textarea`
  padding: 1em;
  background-color: transparent;
  color: #5d5d5d;

  border: 0;
  width: 100%;
  resize: none;
`;

const CommentForm = styled.form`
  display: grid;
  grid-row-gap: 10px;
  flex: 1;

  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);

  margin: 1em;
  padding: 1em;

  background-color: #fff;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
  width: 22em;
`;

const PlaceName = styled.h2`
  margin: 0;
  margin-top: 1em;
`;

const PlaceComment = styled.p`
  margin: 0;
`;

const SaveButton = styled.button`
  background-color: #6495ed;
  border: none;
  border-radius: 4px;
  color: #fff;
  height: 3em;

  &:hover {
    cursor: pointer;
    background-color: #6495edb3;
  }
`;
