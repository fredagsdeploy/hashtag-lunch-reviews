import _ from "lodash";
import React, { ChangeEvent, useMemo, useState } from "react";
import { useRatings } from "../customHooks/api";
import { useBoolean } from "../customHooks/useBoolean";
import { browserHistory } from "../history";
import { postPlace } from "../lib/backend";
import { Place, Rating } from "../types";
import { StatsView } from "./StatsView";

interface Props {
  userId: string;
}

const useSorting = <T extends {}>(
  array: T[],
  key: keyof T,
  ascending: boolean
): T[] => {
  return useMemo(() => _.orderBy(array, [key], [ascending ? "asc" : "desc"]), [
    array,
    key,
    ascending
  ]);
};

export const StatsController = ({ userId }: Props) => {
  const ratingsFromServer = useRatings();

  const [ratings, setRatings] = useState(ratingsFromServer);
  const [ascending, toggleAscending] = useBoolean(false);
  const [sortedBy, setSortedBy] = useState<keyof Rating>("rating");

  const sortedRatings = useSorting(ratings, sortedBy, ascending);

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

  const sortBy = (headerKey: keyof Rating) => {
    if (sortedBy === headerKey) {
      toggleAscending();
    } else {
      setSortedBy(headerKey);
    }
  };

  const addPlace = () => {
    postPlace(newPlace)
      .then((place: Place) => {
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
    const name = event.target.name;
    const value = event.target.value;
    setNewPlace(newPlace => ({
      ...newPlace,
      [name]: value
    }));
  };

  const goToPlacePage = (rating: Rating) => {
    browserHistory.push(`/${rating.placeId}/${rating.placeName}`);
  };

  return (
    <StatsView
      ratings={sortedRatings}
      addRowPressed={toggleIsAddingPlace}
      isAddingPlace={isAddingPlace}
      newPlaceData={newPlace}
      newPlaceDataChange={handleNewPlaceInput}
      sumbitNewPlace={addPlace}
      placeClicked={goToPlacePage}
    />
  );
};
