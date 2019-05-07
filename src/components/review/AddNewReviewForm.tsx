import React, { ChangeEvent, FormEvent, useState } from "react";
import { batch, useDispatch } from "react-redux";
import styled from "styled-components";
import { useRatingByPlaceId } from "../../customHooks/api";
import { useUserContext } from "../../customHooks/useUserContext";
import { postReview } from "../../lib/backend";
import { updateRating } from "../../store/reducers/ratings";
import { addReview } from "../../store/reducers/reviews";
import { NewReview, ReviewRating } from "../../types";
import { CommentForm, SaveButton, TextArea } from "../CommonFormComponents";
import { ModalContainer } from "../ModalContainer";
import { Spinner } from "../Spinner";
import { StarRating } from "../StarRating";

interface Props {
  placeId: string;
  onClose: () => void;
}

export const AddNewReviewForm: React.FC<Props> = ({ onClose, placeId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const place = useRatingByPlaceId(placeId);

  const user = useUserContext()!;
  const newReviewInitalState: NewReview = {
    rating: 0,
    comment: "",
    userId: user.googleUserId,
    placeId: placeId
  };

  const [newReview, setNewReview] = useState(newReviewInitalState);

  const dispatch = useDispatch();

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    postReview(newReview)
      .then(({ review, rating }: ReviewRating) => {
        batch(() => {
          dispatch(updateRating(rating));
          dispatch(addReview(placeId, review));
        });

        onClose();
      })
      .catch(e => {
        console.log("Couldn't post new review", e);
      })
      .then(() => {
        setIsSubmitting(false);
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
    <ModalContainer title={place.placeName} onClose={onClose}>
      {place.comment && <PlaceComment>{place.comment}</PlaceComment>}
      <CommentForm onSubmit={submitReview}>
        <Row style={{ justifyContent: "center" }}>
          <StarRating
            rating={newReview.rating}
            onChange={ratingChangeHandler}
            defaultSize={48}
            mobileSize={48}
          />
        </Row>
        <Row style={{ marginBottom: "1.5rem" }}>
          <TextArea
            value={newReview.comment}
            placeholder={"Lägg till kommentar"}
            name={"comment"}
            onChange={handleNewReviewInput}
          />
        </Row>
        <SaveButton disabled={isSubmitting}>
          {isSubmitting ? (
            <Row style={{ flex: 1 }}>
              <Row />
              Sparar...
              <Row>
                <Spinner color={"#fff"} />
              </Row>
            </Row>
          ) : (
            "Spara"
          )}
        </SaveButton>
      </CommentForm>
    </ModalContainer>
  );
};

const PlaceComment = styled.p`
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
