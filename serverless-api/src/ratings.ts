import {
  getAllReviews,
  getReviewsByPlaceId,
  Review
} from "./repository/reviews";
import * as _ from "lodash";
import { createResponse, LambdaHandler } from "./common";
import { getAllPlaces, getPlaceById, Place } from "./repository/places";

const calculateRating = (reviews: Review[]): number => {
  if (!_.isEmpty(reviews)) {
    const sum = reviews.reduce((sum, review) => review.rating + sum, 0);

    return sum / reviews.length;
  }

  return 0;
};

const calculateNormalizedRating = (place: Place, reviews: Review[]): number => {
  const reviewByUserId = _.groupBy(reviews, "userId");
  const normalizedReviews = _.flatMap<_.Dictionary<Review[]>, Review>(
    reviewByUserId,
    (reviewsForUser, userId) => {
      const ratingValues = _.map(reviewsForUser, r => r.rating);
      const min = _.min(ratingValues) || 0;
      const max = _.max(ratingValues) || 5;
      const normalizer = (v: number) => (5 * (v - min)) / (max - min);

      return reviewsForUser.map(review => ({
        ...review,
        rating: normalizer(review.rating)
      }));
    }
  );

  const normalizedReviewsGroupedByPlaceId = _.groupBy(
    normalizedReviews,
    "placeId"
  );

  return calculateRating(normalizedReviewsGroupedByPlaceId[place.placeId]);
};

export const decoratePlace = (place: Place, reviews: Review[]) => {
  const reviewsByPlace = _.groupBy(reviews, r => r.placeId);
  const rating = calculateRating(reviewsByPlace[place.placeId]);
  const normalizedRating: number = calculateNormalizedRating(place, reviews);

  return {
    ...place,
    rating,
    normalizedRating
  };
};

export const getPlacesWithRatings: LambdaHandler = async () => {
  const reviews = await getAllReviews();
  const places = await getAllPlaces();
  const placesWithRatings = _.map(places, place => decoratePlace(place, reviews))

  const rankedRatings = _.orderBy(placesWithRatings, "rating", "desc").map(
    (r, i) => ({
      ...r,
      rank: i + 1
    })
  );

  return createResponse(200, rankedRatings);
};

export const getPlaceWithRating: LambdaHandler = async event => {
  if (!event.pathParameters) {
    return createResponse(400, { message: "Missing placeId path parameter" });
  }
  const placeId = event.pathParameters.placeId;

  const reviewsForPlace = await getReviewsByPlaceId(placeId);

  const place = await getPlaceById(placeId);
  if (!place) {
    return createResponse(404, { message: `there's no place like ${placeId}` });
  }

  const rating = await decoratePlace(place, reviewsForPlace);

  return createResponse(200, rating);
};
