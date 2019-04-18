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
import { Link } from "react-router-dom";

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
          <NewCommentForm placeId={placeId} />
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

const NewCommentForm = ({ placeId }: Pick<Props, "placeId">) => {
  return (
    <CommentLink to={`/newreview/${placeId}`}>{"Lägg till omdöme"}</CommentLink>
  );
};

const CommentContainer = styled.div`
  grid-area: comments;
  display: flex;
  padding: 0.5em;
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

  flex: 1;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
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

const CommentLink = styled(Link)`
  margin-left: 1em;
  /* white-space: nowrap; */

  overflow: hidden;
  text-overflow: ellipsis;

  color: #5d5d5d;
  font-style: italic;

  flex: 1;
  text-decoration: none;
`;
