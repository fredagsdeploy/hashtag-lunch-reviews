import { getAllReviews } from "./repository/reviews";
import * as _ from "lodash";
import { createResponse, LambdaHandler } from "./common";
import { getAllPlaces } from "./repository/places";

interface Rating {
  placeId: string;
  rating: number;
}

export const getPlacesWithRatings: LambdaHandler = async () => {
  const reviews = await getAllReviews();
  console.log(reviews);

  const places = await getAllPlaces();

  const reviewsByPlace = _.groupBy(reviews, r => r.placeId);

  const placesWithRatings = _.map(places, place => {
    const placeId = place.placeId;
    if (placeId in reviewsByPlace) {
      const reviews = reviewsByPlace[placeId];
      const sum = reviews.reduce((sum, review) => review.rating + sum, 0);

      return {
        ...place,
        rating: sum / reviews.length
      };
    }

    return { ...place, rating: null };
  });

  const rankedRatings = _.orderBy(placesWithRatings, "rating", "desc").map(
    (r, i) => ({
      ...r,
      rank: i + 1
    })
  );

  return createResponse(200, rankedRatings);
};
