import React, { useEffect, useState } from "react";
import { Rating } from "../types";
import { StatsView } from "./StatsView";
import _ from "lodash";

import config from "../config";
import { getRatings, postPlace } from "../lib/spreadsheet";

export const StatsController = () => {
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [sortedBy, setSortedBy] = useState("rating");

  const initClient = () => {
    getRatings()
      .then((ratings: Array<Rating>) => {
        console.log("Loaded data", ratings);
        setRatings(_.orderBy(ratings, [sortedBy], "desc"));
      })
      .catch((err: Error) => {
        console.log("Error on loading data", err);
      });
  };

  useEffect(() => {
    window.gapi.load("client", initClient);
  }, []);

  const sortBy = (headerKey: string) => {
    if (sortedBy === headerKey) {
      setRatings(ratings.reverse());
      return;
    }
    const sortedRatings = _.orderBy(ratings, [headerKey]);
    setSortedBy(headerKey);
    setRatings(sortedRatings);
  };

  const addPlace = () => {
    console.log("shuold add place");
    postPlace({
      comment: "test-place-comment",
      google_maps_link: "",
      name: "test-place-name"
    });
  };

  return (
    <>
      <StatsView ratings={ratings} headerClicked={sortBy} />
      <div onClick={addPlace}>Press me :)</div>
    </>
  );
};
