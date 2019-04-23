import React, { ChangeEvent, useState } from "react";
// @ts-ignore
import { useDispatch } from "react-redux";
import { useRatings } from "../customHooks/api";
import { useBoolean } from "../customHooks/useBoolean";
import { postPlace } from "../lib/backend";
import { updateRating } from "../store/reducers/ratings";
import { Place, Rating } from "../types";
import { StatsView } from "./StatsView";

export const StatsController = () => {
  const ratings = useRatings();

  const newPlaceInitialState: Partial<Place> = {
    placeName: "",
    comment: "",
    googlePlaceId: ""
  };

  const [newPlace, setNewPlace] = useState<Partial<Place>>(
    newPlaceInitialState
  );

  const [isAddingPlace, toggleIsAddingPlace, setIsAddingPlace] = useBoolean(
    false
  );

  const dispatch = useDispatch();

  const addPlace = () => {
    postPlace(newPlace)
      .then((rating: Rating) => {
        dispatch(updateRating(rating));
        setNewPlace(newPlaceInitialState);
        setIsAddingPlace(false);
      })
      .catch(e => {
        console.log("Couldn't post new place", e);
      });
  };

  const handleNewPlaceInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.name) {
      throw new Error("No name on event.target");
    }
    const { name, value } = event.target;
    setNewPlace(newPlace => ({
      ...newPlace,
      [name]: value
    }));
  };

  return (
    <StatsView
      ratings={ratings}
      addRowPressed={toggleIsAddingPlace}
      isAddingPlace={isAddingPlace}
      newPlaceData={newPlace}
      newPlaceDataChange={handleNewPlaceInput}
      submitNewPlace={addPlace}
    />
  );
};
