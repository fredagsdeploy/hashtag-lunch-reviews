import React from "react";
import { Review } from "../types";
import { Cell, Row, LastCell, StarCell, Button } from "./CommonFormComponents";
import { unstable_createResource } from "react-cache";
import { getPlaceById } from "../lib/backend";
import { AddNewReviewForm } from "./AddNewReviewForm";
import FontAwesome from "react-fontawesome";
import { StarRating } from "./StarRating";
import styled from "styled-components";
import { RollReviews } from "./ReviewRoll";
import { useUserContext } from "../customHooks/useUserContext";
import { getPhotoUrl } from "../googlePlaces/googlePlaces";

const placeResource = unstable_createResource(getPlaceById);

interface Props {
  placeId: string;
  reviews: Array<Review>;
  isAddingReview: boolean;
  newReviewData: Partial<Review>;
  sumbitNewReview: Function;
  newReviewDataChange: Function;
  addRowPressed: Function;
}

export const PlaceView = ({
  placeId,
  reviews,
  isAddingReview,
  newReviewData,
  sumbitNewReview,
  newReviewDataChange,
  addRowPressed
}: Props) => {
  const place = placeResource.read(placeId);

  const sum = reviews.reduce((sum, review) => review.rating + sum, 0);
  const rating = sum / reviews.length;

  const user = useUserContext();

  const myReview = reviews.filter(review => review.userId == user.id);

  const bannerContent = (
    <PlaceBannerContent>
      <h2>{place.placeName}</h2>
      <StarCell>
        <StarRating rating={rating} />
      </StarCell>
      <RollReviews reviews={reviews} />
    </PlaceBannerContent>
  );

  const banner = place.googlePlace ? (
    <PlaceBanner
      key={place.googlePlace.photos[0].photo_reference}
      url={getPhotoUrl(place.googlePlace)}
    >
      {bannerContent}
    </PlaceBanner>
  ) : (
    <PlaceBanner>{bannerContent}</PlaceBanner>
  );

  return (
    <>
      {banner}

      {!isAddingReview ? (
        <AddReview>
          <Button onClick={() => addRowPressed()}>Add Review</Button>
        </AddReview>
      ) : (
        <>
          <Header>New review</Header>
          <PlaceRow>
            <AddNewReviewForm
              reviewData={newReviewData}
              newReviewDataChange={newReviewDataChange}
            />
          </PlaceRow>
          <LastCell>
            <FontAwesome
              name="check"
              size="2x"
              onClick={() => sumbitNewReview()}
            />
            <FontAwesome
              name="times"
              size="2x"
              onClick={() => addRowPressed()}
            />
          </LastCell>
        </>
      )}
      {myReview.length > 0 && (
        <>
          <Header>My reviews</Header>
          {myReview.map((r: Review) => (
            <PlaceRow key={r.reviewId}>
              <Cell style={{ gridArea: "name" }}>Todo</Cell>
              {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
              <StarCell style={{ gridArea: "rating" }}>
                <StarRating rating={r.rating} />
              </StarCell>
              <Cell style={{ gridArea: "comment" }}>{r.comment}</Cell>
            </PlaceRow>
          ))}
        </>
      )}
      <Header>All reviews</Header>
      {reviews.map((r: Review) => (
        <PlaceRow key={r.reviewId}>
          <Cell style={{ gridArea: "name" }}>Todo</Cell>
          {/* TODO Fixa så vi har user id och users. Just nu är det bara ett nick fält i reviews objektet.*/}
          <StarCell style={{ gridArea: "rating" }}>
            <StarRating rating={r.rating} />
          </StarCell>
          <Cell style={{ gridArea: "comment" }}>{r.comment}</Cell>
        </PlaceRow>
      ))}
    </>
  );
};

const PlaceRow = styled(Row)`
  display: grid;

  grid-template-columns: 20% 20% auto;
  grid-template-areas: "name rating comment";
  padding: 1em 5em;

  align-items: center;
`;

const PlaceBanner = styled.div<{ url?: string }>`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 15em;

  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);

  text-shadow: -1px 0 2px white, 0 1px 2px white, 1px 0 2px white,
    0 -1px 2px white;
  font-weight: 500;

  background: ${props => (props.url ? `url(${props.url})` : "#fff")};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`;

const PlaceBannerContent = styled.div`
  display: flex;

  align-items: center;
  width: 80%;
`;

const AddReview = styled.div`
  align-self: flex-end;
  padding-right: 10%;
  margin-top: 1em;
`;

const Header = styled.span`
  margin-bottom: -0.5em;
  width: 60%;
  font-weight: 500;
  color: #333;
  margin-top: 2em;
`;
