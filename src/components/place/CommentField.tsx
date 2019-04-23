import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../../customHooks/useUserContext";
import { Review } from "../../types";
import { StarRatingView } from "../StarRating";

interface Props {
  review?: Review;
  placeId: string;
}

export const CommentField = ({
  review,
  placeId,
}: Props) => {
  const user = useUserContext()!;

  return (
    <CommentContainer>
      <UserImage url={user.imageUrl} active={Boolean(review)} />
      <div style={{ height: "2em", display: "flex", alignItems: "center" }}>
        <SpeakTriangle />
      </div>
      <RatingContainer>
        {review ? (
          <CommentOnly review={review} />
        ) : (
          <NewCommentForm placeId={placeId} />
        )}
      </RatingContainer>
    </CommentContainer>
  );
};

interface CommentOnlyProps {
  review: Review;
}

const CommentOnly = ({ review }: CommentOnlyProps) => {
  return (
    <>
      <StarRatingView rating={review.rating} />
      <Comment>{review.comment}</Comment>
    </>
  );
};

const NewCommentForm = ({ placeId }: Pick<Props, "placeId">) => {
  return (
    <CommentLink to={`/ratings/newreview/${placeId}`}>
      {"Lägg till omdöme"}
    </CommentLink>
  );
};

const CommentContainer = styled.div`
  grid-area: comments;
  display: flex;
  padding: 1em;
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
