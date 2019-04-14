import React, { useState } from "react";
import { Review } from "../../types";
import styled from "styled-components";
import { StarRating } from "../StarRating";

interface Props {
  review: Review;
}
export const CommentField = ({ review }: Props) => {
  const [expanded, setexpanded] = useState(false);
  const toggleExpanded = () => {
    setexpanded(!expanded);
  };

  return (
    <CommentContainer>
      <UserImage />
      <SpeakTriangle />
      <RatingConainer>
        <StarRating rating={review.rating} />
        <Comment>{review.comment}</Comment>
      </RatingConainer>
    </CommentContainer>
  );
};

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.div<{ url?: string }>`
  height: 2em;
  width: 2em;

  background: ${props => (props.url ? `url(${props.url})` : "#CC0")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  border-radius: 50%;
`;

const RatingConainer = styled.div`
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
  margin-left: 100px;
  /* white-space: nowrap; */

  overflow: hidden;
  text-overflow: ellipsis;
`;
