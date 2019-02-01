import React, { useEffect, useState, ChangeEvent } from "react";
import { Rating } from "../types";
import { StatsView } from "./StatsView";
import _ from "lodash";

import { getRatings, postPlace } from "../lib/spreadsheet";

export const StatsController = () => {
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [sortedBy, setSortedBy] = useState("rating");

  const newPlaceInitialState = {
    name: "",
    comment: "",
    google_maps_link: ""
  };

  const [newPlace, setNewPlace] = useState(newPlaceInitialState);

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
    try {
      postPlace(newPlace).then((place: Rating) => {
        setNewPlace(newPlaceInitialState);
        setRatings([...ratings, place]);
      });
    } catch (error) {
      console.log("failure posting new place?", error);
    }
  };

  const handleNewPlaceInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
    console.log(event.target.value);
    setNewPlace({ ...newPlace, [event.target.name]: event.target.value });
  };

  return (
    <>
      <StatsView ratings={ratings} headerClicked={sortBy} />
      <input
        name="name"
        onChange={handleNewPlaceInput}
        type="text"
        value={newPlace.name}
      />
      <input
        name="comment"
        onChange={handleNewPlaceInput}
        type="text"
        value={newPlace.comment}
      />
      <input
        name="google_maps_link"
        onChange={handleNewPlaceInput}
        type="text"
        value={newPlace.google_maps_link}
      />
      <input type="button" value="Add new place" onClick={addPlace} />
    </>
  );
};
