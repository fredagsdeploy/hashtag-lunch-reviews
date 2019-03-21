import { getAllReviews } from "./repository/reviews";
import * as _ from "lodash";
import { createResponse } from "./common";
import { getAllPlaces } from "./repository/places";

interface Rating {
  placeId: string;
  rating: number;
}

export const getRatings = async () => {
  const reviews = await getAllReviews();
  console.log(reviews);

  const places = await getAllPlaces();

  const ratings = _.map(_.groupBy(reviews, r => r.placeId), (v, placeId) => {
    const sum = v.reduce((sum, review) => review.rating + sum, 0);
    const { placeName, ...place } = places.find(p => p.placeId === placeId)!;

    return {
      ...place,
      name: placeName,
      rating: sum / v.length
    };
  });
  const rankedRatings = _.orderBy(ratings, "rating", "desc").map((r, i) => ({
    ...r,
    rank: i + 1
  }));

  return createResponse(200, rankedRatings);
};
