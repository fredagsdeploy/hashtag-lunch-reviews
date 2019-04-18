import {
  faHashtag,
  faStar,
  faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useState } from "react";
import styled from "styled-components";
import { useReviewsByPlaceId } from "../../customHooks/api";
import { useFadeState } from "../../customHooks/useFadeState";

import { useUserContext } from "../../customHooks/useUserContext";
import { getPhotoUrl } from "../../googlePlaces/googlePlaces";
import { Rating, Review } from "../../types";
import { SpiderWebChart } from "../SpiderWebChart";
import { Spinner } from "../Spinner";
import { formatStarRating } from "../utils/formatter";
import { CommentField } from "./CommentField";

interface RatingDisplayProps {
  placeId: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ placeId }) => {
  const reviewsFromServer = useReviewsByPlaceId(placeId);
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

const ChartDisplay: React.FC<RatingDisplayProps> = ({ placeId }) => {
  const reviewsFromServer = useReviewsByPlaceId(placeId);

  const chartData = reviewsFromServer.map(review => ({
    value: review.rating,
    max: 5
  }));

  const data =
    chartData.length === 1 ? [...chartData, { value: 0, max: 5 }] : chartData;

  return (
    <ChartRow>
      <SpiderWebChart data={data} />
    </ChartRow>
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
      <Suspense
        fallback={
          <>
            <NameComment>
              <PlaceName>{place.placeName}</PlaceName>
              <PlaceComment>{place.comment}</PlaceComment>
            </NameComment>
            <PlaceRatings>
              <Blue icon={faHashtag} />
              {formatStarRating(place.normalizedRating)}
              <Yellow icon={faStar} />
              {formatStarRating(place.rating)}
            </PlaceRatings>

            <Spinner />
            <div style={{ width: 160 }} />
          </>
        }
      >
        <NameComment>
          <PlaceName>{place.placeName}</PlaceName>
          <PlaceComment>{place.comment}</PlaceComment>
        </NameComment>
        <PlaceRatings>
          <Blue icon={faHashtag} />
          {formatStarRating(place.normalizedRating)}
          <Yellow icon={faStar} />
          {formatStarRating(place.rating)}
        </PlaceRatings>

        <RatingDisplay placeId={placeId} />
        <ChartDisplay placeId={placeId} />
      </Suspense>
    </PlaceRow>
  );
};

const PlaceImage = styled.div<{ url?: string }>`
  grid-area: img;

  background: ${props => (props.url ? `url(${props.url})` : "#6495ed")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  display: grid;
  justify-content: center;
  align-content: center;

  & > svg {
    display: ${props => (props.url ? "none" : "initial")};
  }
`;

const PlaceRow = styled.div`
  display: grid;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  background-color: #fff;

  grid-template-columns: 200px auto auto 160px;
  grid-template-rows: auto auto;
  grid-template-areas:
    "img place rating chart"
    "img comments comments chart";

  @media screen and (max-width: 600px) {
    grid-template-columns: auto;
    grid-template-rows: repeat(4, auto);
    grid-template-areas:
      "img"
      "place"
      "rating"
      "comments";
  }
`;

const ChartRow = styled.div`
  grid-area: chart;
  @media screen and (max-width: 600px) {
    grid-area: img;
  }
`;

const PlaceName = styled.div`
  font-weight: 600;
  padding-bottom: 5px;
`;

const PlaceComment = styled.div``;

const NameComment = styled.div`
  padding: 0.5em;
`;

const PlaceRatings = styled.div`
  grid-area: rating;
  font-size: 1.4em;
  display: flex;
  justify-content: right;
  padding: 0.5em;

  @media screen and (max-width: 600px) {
    justify-content: center;
    font-size: 2.5em;
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
