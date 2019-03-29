import React from "react";
import { Review } from "../types";
import {
  Cell,
  HeaderCell,
  Row,
  Table,
  WhiteRow,
  LastCell,
  StarCell
} from "./CommonFormComponents";
import { unstable_createResource } from "react-cache";
import { getPlaceById } from "../lib/backend";
import { AddNewReviewForm } from "./AddNewReviewForm";
import FontAwesome from "react-fontawesome";
import { StarRating } from "./StarRating";
import styled from "styled-components";
import { RollReviews } from "./ReviewRoll";
import { useUserContext } from "../customHooks/useUserContext";

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

  return (
    <>
      <PlaceBanner>
        <PlaceBannerContent>
          <h2>{place.placeName}</h2>
          <StarCell>
            <StarRating rating={rating} />
          </StarCell>
          <RollReviews reviews={reviews} />
        </PlaceBannerContent>
      </PlaceBanner>

      {!isAddingReview && (
        <AddReview>
          <AddReviewButton onClick={() => addRowPressed()}>
            Add Review
          </AddReviewButton>
        </AddReview>
      )}
      {isAddingReview && (
        <>
          <h3>New review:</h3>
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
          <h3>My reviews:</h3>
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
      <h3>All reviews:</h3>
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

const PlaceBanner = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 15em;

  background-color: #fff;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
`;

const PlaceBannerContent = styled.div`
  display: flex;

  align-items: center;
  width: 80%;
`;

const AddReview = styled.div`
  align-self: flex-end;
  width: 20%;
  margin-top: 1em;
`;

const AddReviewButton = styled.div`
  background-color: #fff;
  padding: 0.3em 1em;

  width: max-content;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
