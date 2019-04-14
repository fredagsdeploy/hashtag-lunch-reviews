import React, { useState } from "react";

import { unstable_createResource } from "react-cache";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHashtag } from "@fortawesome/free-solid-svg-icons";

import { useUserContext } from "../../customHooks/useUserContext";
import { getPhotoUrl } from "../../googlePlaces/googlePlaces";
import { getPlaceById, getReviewsForPlace } from "../../lib/backend";
import { CommentField } from "./CommentField";

const placeResource = unstable_createResource(getPlaceById);
const reviewsResource = unstable_createResource(getReviewsForPlace);

interface Props {
  placeId: string;
}

export const PlaceRowView = ({ placeId }: Props) => {
  const place = placeResource.read(placeId);
  const reviewsFromServer = reviewsResource.read(placeId);
  const [reviews, setReviews] = useState(reviewsFromServer);

  const sum = reviews.reduce((sum, review) => review.rating + sum, 0);
  const rating = sum / reviews.length;

  const user = useUserContext();

  const myReview = reviews.filter(review => review.userId == user.id)[0];
  const displayReview = myReview
    ? myReview
    : reviews[2]
    ? reviews[2]
    : undefined;

  const image = place.googlePlace ? (
    <PlaceImage
      key={place.googlePlace.photos[0].photo_reference}
      url={getPhotoUrl(place.googlePlace)}
    />
  ) : (
    <PlaceImage />
  );

  return (
    <PlaceRow>
      {image}
      <PlaceContent>
        <MetaData>
          <NameComment>
            <PlaceName>{place.placeName}</PlaceName>
            <PlaceComment>{place.comment}</PlaceComment>
          </NameComment>
          <PlaceRatings>
            <Blue icon={faHashtag} />
            {rating}
            <Yellow icon={faStar} />
            {rating}
          </PlaceRatings>
        </MetaData>
        {displayReview && <CommentField review={displayReview} />}
      </PlaceContent>
    </PlaceRow>
  );
};

const PlaceImage = styled.div<{ url?: string }>`
  width: 13em;
  height: 10em;

  background: ${props => (props.url ? `url(${props.url})` : "#aaf")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`;

const PlaceRow = styled.div`
  display: flex;

  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);

  background-color: #fff;

  align-items: stretch;
  width: 80%;
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
`;

const PlaceName = styled.div`
  font-weight: 500;
  padding-bottom: 5px;
`;

const PlaceComment = styled.div``;
const NameComment = styled.div``;

const PlaceRatings = styled.div`
  font-size: 1.4em;
`;

const Yellow = styled(FontAwesomeIcon)`
  color: #f8c51c;
  margin: 0 5px;
`;

const Blue = styled(FontAwesomeIcon)`
  color: #6495ed;
  margin: 0 5px;
`;
