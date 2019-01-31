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

  return <StatsView ratings={ratings} headerClicked={sortBy} />;
};
