import { getAllReviews } from "./repository/reviews";
import * as _ from "lodash";
import { createResponse, LambdaHandler } from "./common";
import { getAllPlaces } from "./repository/places";
import fetch from "node-fetch";
import config from "../config";

interface Rating {
  placeId: string;
  rating: number;
}

export const getPlacesWithRatings: LambdaHandler = async () => {
  const reviews = await getAllReviews();

  const places = await getAllPlaces();

  const reviewsByPlace = _.groupBy(reviews, r => r.placeId);

  const placesWithRatings = await Promise.all(
    _.map(places, async place => {
      const placeId = place.placeId;
      if (placeId in reviewsByPlace) {
        const reviews = reviewsByPlace[placeId];
        const sum = reviews.reduce((sum, review) => review.rating + sum, 0);

        const rating = {
          ...place,
          rating: sum / reviews.length
        };

        if (place.googlePlaceId) {
          const googlePlace = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
              place.googlePlaceId
            }&key=${config.googlePlacesApiKey}`
          ).then(r => r.json());

          return {
            ...rating,
            googlePlace: googlePlace.result
          };
        } else {
          return rating;
        }
      }

      return { ...place, rating: 0 };
    })
  );

  const rankedRatings = _.orderBy(placesWithRatings, "rating", "desc").map(
    (r, i) => ({
      ...r,
      rank: i + 1
    })
  );

  return createResponse(200, rankedRatings);
};
