import React, { ChangeEvent } from "react";
import { Place, Rating } from "../types";
import { StarRating } from "./StarRating";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import {
  Cell,
  LastCell,
  Row,
  StarCell,
  WhiteRow,
  Button
} from "./CommonFormComponents";
import styled from "styled-components";
import { PlaceRowView } from "./place/PlaceRowView";

interface Props {
  ratings: Array<Rating>;
  addRowPressed: () => void;
  newPlaceData: Partial<Place>;
  newPlaceDataChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isAddingPlace: boolean;
  sumbitNewPlace: () => void;
  placeClicked: (rating: Rating) => void;
}

import places from "../seeds/places.json";
import reviews from "../seeds/reviews.json";
import { postPlace, postMigrateReview } from "../lib/backend";

const seed = () => {
  console.log(places);

  const placesWithReview = places.filter(place => place.googlePlaceId).map(place => {
    const reviewsForPlace = reviews.filter(review => review.placeId === place.placeId);
    return {
      ...place,
      reviews: reviewsForPlace
    }
  });



  placesWithReview.forEach(place => {
    postPlace({
      googlePlaceId: place.googlePlaceId,
      comment: place.comment,
      placeName: place.placeName
    }).then(placeEntity => {
      place.reviews.forEach(review => {
        const { nick, comment, rating } = review;
        postMigrateReview({ nick, comment: (comment || " "), userId: " ", rating, placeId: placeEntity.placeId })
      })
    })
  });

}

export const StatsView = ({
  ratings,
  addRowPressed,
  newPlaceData,
  newPlaceDataChange,
  isAddingPlace,
  sumbitNewPlace,
  placeClicked
}: Props) => {
  return (
    <>
      {!isAddingPlace && (
        <AddPlaceContainer>
          <Button onClick={addRowPressed}>Add new place</Button>
          <Button onClick={() => seed()}>Seed</Button>
        </AddPlaceContainer>
      )}
      {isAddingPlace && (
        <>
          <h3>New place:</h3>
          <StatsContainerNoHover>
            <AddNewPlaceForm
              newPlaceDataChange={newPlaceDataChange}
              placeData={newPlaceData}
            />
          </StatsContainerNoHover>
          <WhiteRow>
            <LastCell>
              <div onClick={sumbitNewPlace}>OK</div>
              <div onClick={addRowPressed}>NEJ</div>
            </LastCell>
          </WhiteRow>
        </>
      )}
      <RatingsListContainer>
        {ratings.map(rating => (
          <PlaceRowView
            key={rating.placeId}
            rating={rating}
            placeId={rating.placeId}
          />
        ))}
      </RatingsListContainer>
    </>
  );
};

const RatingsListContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(1fr, 800px);
  grid-column-gap: 10px;
`;

const StatsContainerNoHover = styled(Row)`
  display: grid;
  @media (min-width: 900px) {
    grid-template-columns: 15% 15% 45% auto;
    grid-template-areas: "rating normalized-rating comment comment link";
    padding: 2em 5em;
  }

  @media (max-width: 900px) {
    grid-template-columns: 25% 25% 25% auto;
    grid-template-rows: 50% auto;
    grid-template-areas:
      "rating rating normalized-rating normalized-rating"
      "comment comment comment link";
    padding: 2em 2em;
  }
  align-items: center;
`;

const AddPlaceContainer = styled.div`
  align-self: flex-end;
  padding-right: 10%;
  margin-top: 1em;
`;
