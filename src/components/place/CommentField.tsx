import React, {
  useState,
  ChangeEvent,
  MouseEventHandler,
  FormEvent
} from "react";
import { Review, NewReview, Omit } from "../../types";
import styled from "styled-components";
import { StarRating, StarRatingView } from "../StarRating";
import { useUserContext } from "../../customHooks/useUserContext";
import { postReview } from "../../lib/backend";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  review?: Review;
  placeId: string;
  afterSubmit: (review: Review) => void;
  recentlySaved: boolean;
}

export const CommentField = ({
  review,
  placeId,
  afterSubmit,
  recentlySaved
}: Props) => {
  const user = useUserContext();

  return (
    <CommentContainer>
      <UserImage url={user.imageUrl} active={Boolean(review)} />
      <div style={{ height: "2em", display: "flex", alignItems: "center" }}>
        <SpeakTriangle />
      </div>
      <RatingContainer>
        {review ? (
          <CommentOnly review={review} recentlySaved={recentlySaved} />
        ) : (
          <NewCommentForm placeId={placeId} afterSubmit={afterSubmit} />
        )}
      </RatingContainer>
    </CommentContainer>
  );
};

interface CommentOnlyProps {
  review: Review;
  recentlySaved: boolean;
}

const CommentOnly = ({ review, recentlySaved }: CommentOnlyProps) => {
  return (
    <>
      <StarRatingView rating={review.rating} />
      <Comment>{review.comment}</Comment>
      {recentlySaved && (
        <FontAwesomeIcon icon={faCheckCircle} color={"#6495ed"} />
      )}
    </>
  );
};

const NewCommentForm = ({
  placeId,
  afterSubmit
}: Pick<Props, "placeId" | "afterSubmit">) => {
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
      .then((review: Review) => {
        afterSubmit(review);
      })
      .catch(e => {
        console.log("Couldn't post new review", e);
      });
  };

  const handleNewReviewInput = (event: ChangeEvent<HTMLInputElement>) => {
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
      <StarRating rating={newReview.rating} onChange={ratingChangeHandler} />
      <Comment>
        <CommentInput
          value={newReview.comment}
          placeholder={"Lägg till omdöme"}
          name={"comment"}
          onChange={handleNewReviewInput}
        />
      </Comment>
    </CommentForm>
  );
};

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 600px) {
    align-items: stretch;
  }
`;

const UserImage = styled.div<{ url?: string; active: boolean }>`
  height: 2em;
  width: 2em;

  background: ${props => (props.url ? `url(${props.url})` : "#CC0")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  border-radius: 50%;

  filter: ${props => (props.active ? "grayscale(0)" : "grayscale(100%)")};
  transition: filter 3000ms;
`;

const RatingContainer = styled.div`
  background-color: #efefef;
  border-radius: 5px;

  padding: 1em;

  display: flex;
  align-items: center;

  flex: 1;

  overflow: "eclipsis";
`;

const SpeakTriangle = styled.div`
  margin-left: 1em;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;

  border-right: 10px solid #efefef;
`;

const Comment = styled.div`
  margin-left: 1em;
  /* white-space: nowrap; */

  overflow: hidden;
  text-overflow: ellipsis;

  color: #5d5d5d;
  font-style: italic;

  flex: 1;
`;

const CommentInput = styled.input`
  background-color: transparent;

  border: 0;
  width: 100%;
`;

const CommentForm = styled.form`
  display: flex;
  flex: 1;
  align-items: center;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
