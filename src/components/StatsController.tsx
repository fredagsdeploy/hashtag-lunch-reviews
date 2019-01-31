import React, { useEffect, useState } from "react";
import { Rating } from "../types";
import StatsView from "./StatsView";
import _ from "lodash";

import config from "../config";
import { load } from "../spreadsheet";

export default () => {
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [sortedBy, setSortedBy] = useState("rating");

  const initClient = () => {
    window.gapi.client
      .init({
        apiKey: config.apiKey,
        discoveryDocs: config.discoveryDocs
      })
      .then(load)
      .then((ratings: Array<Rating>) => {
        console.log("Loaded data", ratings);
        setRatings(ratings.sort(byRating));
      })
      .catch((err: Error) => {
        console.log("Error on loading data", err);
      });
  };

  useEffect(() => {
    window.gapi.load("client", initClient);
    return function() {};
  }, []);

  const compareString = (s1: String, s2: String) => {
    if (s1 === s2) {
      return 0;
    }
    if (s1 < s2) {
      return -1;
    }
    return 1;
  };

  const byName = (r1: Rating, r2: Rating): number =>
    compareString(r1.name, r2.name);
  const byRating = (r1: Rating, r2: Rating): number => r1.rating - r2.rating;
  const byComment = (r1: Rating, r2: Rating): number =>
    compareString(r1.comment, r2.comment);

  const selectSortFunction = (
    headerKey: any
  ): ((r1: Rating, r2: Rating) => number) => {
    type Dictionary = { [index: string]: ((r1: Rating, r2: Rating) => number) };
    const functions: Dictionary = {
      name: byName,
      rating: byRating,
      comment: byComment
    };
    if (headerKey in functions) {
      return functions[headerKey];
    }
    throw new Error(`no function found for header ${headerKey}`);
  };

  const sortBy = (headerKey: string) => {
    if (sortedBy === headerKey) {
      setRatings(ratings.reverse());
      return;
    }
    const sortFunction = selectSortFunction(headerKey);
    const sortedRatings = ratings.sort(sortFunction);
    setSortedBy(headerKey);
    setRatings(sortedRatings);
  };

  return <StatsView ratings={ratings} headerClicked={sortBy} />;
};
