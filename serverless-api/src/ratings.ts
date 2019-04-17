import { getAllReviews, getReviewsByPlaceId } from "./repository/reviews";
import * as _ from "lodash";
import { createResponse, LambdaHandler } from "./common";
import { getAllPlaces, getPlaceByGoogleId, getPlaceById } from "./repository/places";
import { getGooglePlace } from "./googlePlaces/googlePlaces";
import { getReviewsByPlace } from "./reviews";

interface Rating {
  placeId: string;
  rating: number;
}

const calculateRating = (place, reviews) => {
  if (!_.isEmpty(reviews)) {
    const sum = reviews.reduce((sum, review) => review.rating + sum, 0);

    return sum / reviews.length
  }

  return 0;
}

const getGooglePlaceInfo = async (place) => {
  if (place.googlePlaceId) {
    const googlePlace = await getGooglePlace(place.googlePlaceId).then(
      r => r.json()
    );
    return googlePlace.result
  }
}

const decoratePlace = async (place, reviews) => {
  const rating = calculateRating(place, reviews)
  const googlePlace = await getGooglePlaceInfo(place);

  return {
    ...place,
    rating,
    googlePlace
  }
}

export const getPlacesWithRatings: LambdaHandler = async () => {
  const reviews = await getAllReviews();
  const places = await getAllPlaces();

  const reviewsByPlace = _.groupBy(reviews, r => r.placeId);

  const placesWithRatings = await Promise.all(
    _.map(places, place => decoratePlace(place, reviewsByPlace[place.placeId]))
  );

  const rankedRatings = _.orderBy(placesWithRatings, "rating", "desc").map(
    (r, i) => ({
      ...r,
      rank: i + 1
    })
  );

  return createResponse(200, rankedRatings);
};
