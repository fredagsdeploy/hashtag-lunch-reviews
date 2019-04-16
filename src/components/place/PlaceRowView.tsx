import React, { useState, Suspense } from "react";

import { unstable_createResource } from "react-cache";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHashtag,
  faUtensils
} from "@fortawesome/free-solid-svg-icons";

import { useUserContext } from "../../customHooks/useUserContext";
import { getPhotoUrl } from "../../googlePlaces/googlePlaces";
import { getPlaceById, getReviewsForPlace } from "../../lib/backend";
import { CommentField } from "./CommentField";
import { Review, Rating } from "../../types";
import { useFadeState } from "../../customHooks/useFadeState";
import { Spinner } from "../Spinner";
import { formatStarRating } from "../utils/formatter";
import { SpiderWebChart, getRandomData } from "../SpiderWebChart";

const reviewsResource = unstable_createResource(getReviewsForPlace);

const RatingDisplay = ({ placeId }: { placeId: string }) => {
  const reviewsFromServer = reviewsResource.read(placeId);
  const [reviews, setReviews] = useState<Review[]>(reviewsFromServer);

  const user = useUserContext();

  const myReview = reviews.filter(
    review => review.user.googleUserId == user.googleUserId
  )[0];

  const [recentlySaved, setRecentlySaved] = useFadeState(false, 3000);

  return (
    <CommentField
      review={myReview}
      placeId={placeId}
      afterSubmit={(review: Review) => {
        setReviews(reviews => [...reviews, review]);
        setRecentlySaved(true);
      }}
      recentlySaved={recentlySaved}
    />
  );
};

interface Props {
  placeId: string;
  rating: Rating;
}

export const PlaceRowView = ({ placeId, rating: place }: Props) => {
  return (
    <PlaceRow>
      <PlaceImage
        url={
          place.googlePlace && place.googlePlace.photos
            ? getPhotoUrl(place.googlePlace)
            : undefined
        }
      >
        <FontAwesomeIcon icon={faUtensils} size={"3x"} />
      </PlaceImage>

      <PlaceContent>
        <MetaData>
          <NameComment>
            <PlaceName>{place.placeName}</PlaceName>
            <PlaceComment>{place.comment}</PlaceComment>
          </NameComment>
          <PlaceRatings>
            <Blue icon={faHashtag} />
            {formatStarRating(place.rating)}
            <Yellow icon={faStar} />
            {formatStarRating(place.rating)}
          </PlaceRatings>
        </MetaData>
        <Suspense fallback={<Spinner />}>
          <RatingDisplay placeId={placeId} />
        </Suspense>
      </PlaceContent>
      <SpiderWebChart data={getRandomData(5)} />
    </PlaceRow>
  );
};

const PlaceImage = styled.div<{ url?: string }>`
  flex: 1;
  max-width: 13em;
  height: 10em;

  background: ${props => (props.url ? `url(${props.url})` : "#6495ed")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    display: ${props => (props.url ? "none" : "initial")};
  }

  @media screen and (max-width: 600px) {
    max-width: initial;
    flex: initial;
  }
`;

const PlaceRow = styled.div`
  display: flex;

  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);

  background-color: #fff;

  align-items: stretch;

  margin: 1em;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const PlaceContent = styled.div`
  padding: 1em;
  flex: 1;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
`;

const MetaData = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const PlaceName = styled.div`
  font-weight: 600;
  padding-bottom: 5px;
`;

const PlaceComment = styled.div``;
const NameComment = styled.div``;

const PlaceRatings = styled.div`
  font-size: 1.4em;
  display: flex;

  @media screen and (max-width: 600px) {
    justify-content: center;
    font-size: 2.5em;
    margin: 1em 0;
  }
`;

const Yellow = styled(FontAwesomeIcon)`
  color: #f8c51c;
  margin: 0 5px;
`;

const Blue = styled(FontAwesomeIcon)`
  color: #6495ed;
  margin: 0 5px;
`;
