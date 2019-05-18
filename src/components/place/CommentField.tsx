import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { useUserContext } from "../../customHooks/useUserContext";
import { Review, User } from "../../types";
import { StarRatingView } from "../StarRating";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  review?: Review;
  placeId: string;
  user: User;
  style?: CSSProperties;
}

export const CommentField = ({ user, review, placeId, style }: Props) => {
  if (!user) return null;

  return (
    <CommentContainer style={style}>
      {review ? (
        <UserImage url={user.imageUrl} active={Boolean(review)} />
      ) : (
        <RoundLink to={`/ratings/newreview/${placeId}`}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ fontSize: "1.1rem", color: "#fff" }}
          />
        </RoundLink>
      )}
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

interface SelfCommentFieldProps {
  review?: Review;
  placeId: string;
}

export const SelfCommentField = ({
  review,
  placeId
}: SelfCommentFieldProps) => {
  const user = useUserContext()!;

  return (
    <CommentField
      placeId={placeId}
      review={review}
      user={user}
      style={{ gridArea: "comments" }}
    />
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
  display: flex;
  padding: 1em;
`;

const round = css`
  height: 2em;
  width: 2em;
  border-radius: 50%;
`;

const UserImage = styled.div<{ url?: string; active: boolean }>`
  ${round}
  background: ${props => (props.url ? `url(${props.url})` : "#CC0")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

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

  flex: 1;
`;

const CommentLink = styled(Link)`
  margin-left: 1em;
  /* white-space: nowrap; */

  overflow: hidden;
  text-overflow: ellipsis;

  color: #5d5d5d;

  flex: 1;
  text-decoration: none;
`;

const RoundLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: cornflowerblue;
  ${round}
`;
