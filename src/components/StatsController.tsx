import _ from "lodash";
import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import { useBoolean } from "../customHooks/useBoolean";
import { getRatings, postPlace } from "../lib/spreadsheet";
import { Rating } from "../types";
import { StatsView } from "./StatsView";
import { browserHistory } from "../history";
import { unstable_createResource } from "react-cache";

const tableResource = unstable_createResource(getRatings);

interface Props {
  userId: string;
}

const useRatings = () => {
  const ratings = tableResource.read(0);

  return ratings;
};

const useSorting = <T extends {}>(
  array: T[],
  key: keyof T,
  ascending: boolean
): T[] => {
  return useMemo(() => _.orderBy(array, key, [ascending]), [
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

  console.log("userId", userId);

  console.log({ sortedRatings });

  const newPlaceInitialState = {
    name: "",
    comment: "",
    google_maps_link: ""
  };

  const [newPlace, setNewPlace] = useState(newPlaceInitialState);

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
    console.log("shuold add place");
    try {
      postPlace(newPlace).then((place: Rating) => {
        setNewPlace(newPlaceInitialState);
        setIsAddingPlace(false);
        setRatings([...sortedRatings, place]);
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

  const goToPlacePage = (rating: Rating) => {
    console.log(`row clicked ${rating.name}`);
    browserHistory.push(`/${rating.id}/${rating.name}`);
  };

  return (
    <StatsView
      ratings={sortedRatings}
      headerClicked={sortBy}
      addRowPressed={() => toggleIsAddingPlace()}
      isAddingPlace={isAddingPlace}
      newPlaceData={newPlace}
      newPlaceDataChange={handleNewPlaceInput}
      sumbitNewPlace={addPlace}
      placeClicked={goToPlacePage}
    />
  );
};
