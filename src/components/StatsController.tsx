import _ from "lodash";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useBoolean } from "../customHooks/useBoolean";
import { getRatings, postPlace } from "../lib/spreadsheet";
import { Rating } from "../types";
import { StatsView } from "./StatsView";

export const StatsController = () => {
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [sortedBy, setSortedBy] = useState("rating");

  const newPlaceInitialState = {
    name: "",
    comment: "",
    google_maps_link: ""
  };

  const [newPlace, setNewPlace] = useState(newPlaceInitialState);

  const [isAddingPlace, toggleIsAddingPlace, setIsAddingPlace] = useBoolean(
    false
  );

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
        setIsAddingPlace(false);
        setRatings([...ratings, place]);
      });
    } catch (error) {
      console.log("failure posting new place?", error);
    }
  };

  const handleNewPlaceInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.name) {
      throw new Error("No name on event.target");
    }
    console.log(event.target.name);
    console.log(event.target.value);
    setNewPlace({ ...newPlace, [event.target.name]: event.target.value });
  };

  return (
    <StatsView
      ratings={ratings}
      headerClicked={sortBy}
      addRowPressed={() => toggleIsAddingPlace()}
      isAddingPlace={isAddingPlace}
      newPlaceData={newPlace}
      newPlaceDataChange={handleNewPlaceInput}
      sumbitNewPlace={addPlace}
    />
  );
};
