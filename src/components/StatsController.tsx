import _ from "lodash";
import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import { useBoolean } from "../customHooks/useBoolean";
import { getRatings, postPlace } from "../lib/backend";
import { Rating, Place } from "../types";
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

  console.log("userId", userId);

  console.log({ sortedRatings });

  const newPlaceInitialState: Partial<Place> = {
    placeName: "",
    comment: "",
    google_maps_link: ""
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
        browserHistory.push(`/${place.placeId}/${place.placeName}`);
        //setRatings([...sortedRatings, place]);
      })
      .catch(e => {
        console.log("Couldn't post new place", e);
      });
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
    browserHistory.push(`/${rating.placeId}/${rating.name}`);
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
