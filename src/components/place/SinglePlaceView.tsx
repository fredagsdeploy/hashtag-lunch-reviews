import {
  faGlobe,
  faHashtag,
  faMap,
  faStar,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import styled from "styled-components";
import { useRatingByPlaceId, useReviewsByPlaceId } from "../../customHooks/api";
import { ModalContainer } from "../ModalContainer";
import { TabMenuItem } from "../StatusBar";
import { formatStarRating } from "../utils/formatter";
import { CommentField } from "./CommentField";
import { PlaceImage } from "./PlaceRowView";
import { useUserContext } from "../../customHooks/useUserContext";
import _, { Dictionary } from "lodash";
import { Review, User } from "../../types";
import { useCollapse } from "../../customHooks/useCollapse";

interface Props {
  placeId: string;
  onClose: () => void;
}

const getUsersGrouped = (
  reviews: Review[],
  user: User | null
): [Review[], Dictionary<Review[]>] => {
  const reviewsGroupedByUser = _.groupBy(
    reviews,
    review => review.user.googleUserId
  );

  if (user) {
    const { [user.googleUserId]: myReviews, ...rest } = reviewsGroupedByUser;
    return [myReviews || [], rest];
  } else {
    return [[], reviewsGroupedByUser];
  }
};

export const SinglePlaceView: React.FC<Props> = ({ onClose, placeId }) => {
  const user = useUserContext();

  const rating = useRatingByPlaceId(placeId);

  const reviews = useReviewsByPlaceId(placeId);

  const [myReviews, reviewsGroupedByUser] = getUsersGrouped(reviews, user);

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
      {user && myReviews.length > 0 && (
        <ReviewsContainer placeId={placeId} reviews={myReviews} />
      )}
      {_.map(reviewsGroupedByUser, (reviews, userGoogleId) => (
        <ReviewsContainer
          key={userGoogleId}
          reviews={reviews}
          placeId={placeId}
        />
      ))}
    </ModalContainer>
  );
};

interface ReviewsProps {
  reviews: Review[];
  placeId: string;
}

const ReviewsContainer: React.FC<ReviewsProps> = ({ reviews, placeId }) => {
  const firstElementRef = useRef<HTMLDivElement>(null);
  const allReviewsRef = useRef<HTMLDivElement>(null);

  const [height, isOpen, toggleIsOpen] = useCollapse(
    allReviewsRef,
    firstElementRef
  );

  return (
    <>
      <ReviewsContainerDiv style={{ height: `${height}px` }}>
        <div ref={allReviewsRef}>
          <div ref={firstElementRef}>
            <CommentField
              key={reviews[0].reviewId}
              review={reviews[0]}
              placeId={placeId}
              user={reviews[0].user}
            />
          </div>
          {reviews.slice(1).map(review => (
            <CommentField
              key={review.reviewId}
              review={review}
              placeId={placeId}
              user={review.user}
            />
          ))}
        </div>
      </ReviewsContainerDiv>
      {reviews.length > 1 && (
        <div
          onClick={toggleIsOpen}
          style={{ width: "100%", textAlign: "center", cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </div>
      )}
    </>
  );
};

const ReviewsContainerDiv = styled.div`
  transition: height 300ms;
  overflow: hidden;
`;

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
