import {
  faGlobe,
  faHashtag,
  faMap,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import { useRatingByPlaceId, useReviewsByPlaceId } from "../../customHooks/api";
import { ModalContainer } from "../ModalContainer";
import { TabMenuItem } from "../StatusBar";
import { formatStarRating } from "../utils/formatter";
import { CommentField } from "./CommentField";
import { PlaceImage } from "./PlaceRowView";
import { useUserContext } from "../../customHooks/useUserContext";

interface Props {
  placeId: string;
  onClose: () => void;
}

export const SinglePlaceView: React.FC<Props> = ({ onClose, placeId }) => {
  const rating = useRatingByPlaceId(placeId);

  const reviews = useReviewsByPlaceId(placeId);

  const user = useUserContext();

  return (
    <ModalContainer
      title={
        <Bar>
          {rating.googlePlace ? (
            <StyledLink
              href={rating.googlePlace.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TabMenuItem title="Webbplats" icon={faGlobe} />
            </StyledLink>
          ) : (
            <TabMenuItem title="Webbplats" icon={faGlobe} />
          )}
          {rating.googlePlace ? (
            <StyledLink
              href={rating.googlePlace.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TabMenuItem title="Maps" icon={faMap} />
            </StyledLink>
          ) : (
            <TabMenuItem title="Maps" icon={faMap} />
          )}
        </Bar>
      }
      onClose={onClose}
    >
      <StyledPlaceImage url={rating.photoUrl || undefined} />
      <PlaceName>{rating.placeName}</PlaceName>
      <div>{rating.comment}</div>
      <PlaceRatings>
        <Blue icon={faHashtag} />
        {formatStarRating(rating.normalizedRating)}
        <Yellow icon={faStar} />
        {formatStarRating(rating.rating)}
      </PlaceRatings>
      {user && <CommentField placeId={placeId} user={user} />}
      {reviews.map(review => (
        <CommentField
          key={review.reviewId}
          review={review}
          placeId={placeId}
          user={review.user}
        />
      ))}
    </ModalContainer>
  );
};

const PlaceName = styled.h2`
  margin: 1rem 0 0;
`;

const StyledPlaceImage = styled(PlaceImage)`
  height: 300px;
  margin: 0 -1rem;

  @media screen and (max-width: 600px) {
    width: 100vw;
  }
`;

const StyledLink = styled.a`
  color: cornflowerblue;
  text-decoration: none;
  padding: 0.8rem 3.2rem;
  &:hover {
    background-color: #fff2;
    cursor: pointer;
  }
`;

const Bar = styled.div`
  display: flex;
  background-color: white;
  color: inherit;
  justify-content: center;
  width: 100%;
`;

const PlaceRatings = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2.5em;
  padding: 1em;
`;

const Yellow = styled(FontAwesomeIcon)`
  color: #f8c51c;
  margin: 0 5px;
`;

const Blue = styled(FontAwesomeIcon)`
  color: #6495ed;
  margin: 0 5px;
`;
