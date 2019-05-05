import { faHashtag, faStar, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useReviewsByPlaceId } from "../../customHooks/api";
import { useMedia } from "../../customHooks/useMedia";

import { useUserContext } from "../../customHooks/useUserContext";
import { Rating } from "../../types";
import { ErrorBoundary } from "../ErrorBoundary";
import { SpiderWebChart } from "../SpiderWebChart";
import { Spinner } from "../Spinner";
import { formatStarRating } from "../utils/formatter";
import { SelfCommentField } from "./CommentField";

interface RatingDisplayProps {
  placeId: string;
}

const CommentDisplay: React.FC<RatingDisplayProps> = ({ placeId }) => {
  const reviews = useReviewsByPlaceId(placeId);

  const user = useUserContext()!;

  const myReview = reviews.filter(
    review => review.user.googleUserId === user.googleUserId
  )[0];

  return <SelfCommentField review={myReview} placeId={placeId} />;
};

const ChartDisplay: React.FC<RatingDisplayProps> = ({ placeId }) => {
  const reviews = useReviewsByPlaceId(placeId);

  const size = useMedia(["(max-width: 600px)"], [100], 160);
  const radius = useMedia(["(max-width: 600px)"], [40], 60);

  const chartData = useMemo(
    () =>
      reviews.map(review => ({
        value: review.rating,
        max: 5
      })),
    [reviews]
  );

  const data =
    chartData.length === 1 ? [...chartData, { value: 0, max: 5 }] : chartData;

  return (
    <SpiderWebChart data={data} radius={radius} width={size} height={size} />
  );
};

interface Props {
  placeId: string;
  rating: Rating;
}

const RatingsDisplay = ({ rating }: { rating: Rating }) => (
  <PlaceRatings>
    <Blue icon={faHashtag} />
    {formatStarRating(rating.normalizedRating)}
    <Yellow icon={faStar} />
    {formatStarRating(rating.rating)}
  </PlaceRatings>
);

export const PlaceRowView = ({ placeId, rating: place }: Props) => {
  const display = useMedia(["(max-width: 600px)"], ["mobile"], "desktop");

  return (
    <PlaceRow>
      <StyledLink to={`/ratings/${place.placeId}`}>
        <PlaceImage
          url={place.photoUrl || undefined}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          {display === "mobile" && (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginRight: "0.5rem"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",

                    backgroundColor: "white"
                  }}
                >
                  <ChartDisplay placeId={placeId} />
                </div>
                <div
                  style={{
                    borderRadius: "40px",
                    backgroundColor: "white",
                    marginTop: "0.5rem"
                  }}
                >
                  <RatingsDisplay rating={place} />
                </div>
              </div>
            </div>
          )}
        </PlaceImage>
      </StyledLink>

      <NameComment>
        <StyledLink to={`/ratings/${place.placeId}`}>
          <PlaceName>{place.placeName}</PlaceName>
        </StyledLink>
        <PlaceComment>{place.comment}</PlaceComment>
      </NameComment>
      {display === "desktop" && <RatingsDisplay rating={place} />}
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary>
          <CommentDisplay placeId={placeId} />
          {display === "desktop" && (
            <ChartRow>
              <ChartDisplay placeId={placeId} />
            </ChartRow>
          )}
        </ErrorBoundary>
      </Suspense>
    </PlaceRow>
  );
};

const StyledLink = styled(Link)`
  color: #5d5d5d;
  text-decoration: none;
  grid-area: img;

  &:visited {
    color: #5d5d5d;
    text-decoration: none;
  }
`;

export const PlaceImage = styled.div<{ url?: string }>`
  background: ${props => (props.url ? `url(${props.url})` : `url(${require("../../images/utensils-solid.svg")}) #6495ed`)};
  background-repeat: no-repeat;
  background-size: ${props => (props.url ? "cover" : "60px")};
  background-position: center center;
`;

const PlaceRow = styled.div`
  display: grid;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  background-color: #fff;
  min-height: 160px;

  grid-template-columns: 200px auto auto 160px;
  grid-template-rows: auto auto;
  grid-template-areas:
    "img place rating chart"
    "img comments comments chart";

  @media screen and (max-width: 600px) {
    grid-template-columns: auto;
    grid-template-rows: 160px repeat(3, auto);
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
  padding: 1em;
`;

const PlaceRatings = styled.div`
  grid-area: rating;
  font-size: 1.4rem;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  @media screen and (max-width: 600px) {
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding: 0.3rem;
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
