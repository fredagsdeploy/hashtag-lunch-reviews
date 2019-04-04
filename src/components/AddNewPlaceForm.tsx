import React from "react";
import { Place } from "../types";
import { Cell, TextInput, WhiteRow } from "./CommonFormComponents";

interface EditPlaceRowProps {
  placeData: Partial<Place>;
  newPlaceDataChange: Function;
}

export const AddNewPlaceForm = ({
  placeData,
  newPlaceDataChange
}: EditPlaceRowProps) => {
  const { placeName, google_maps_link, comment } = placeData;
  if (
    placeName === undefined ||
    google_maps_link === undefined ||
    comment === undefined
  ) {
    throw new Error(
      `Missing members in place data ${JSON.stringify(placeData)}`
    );
  }

  return (
    <>
      <Cell style={{ gridArea: "rating" }}>
        <TextInput
          placeholder="Name"
          name="placeName"
          value={placeName}
          onChange={newPlaceDataChange}
        />
      </Cell>
      <Cell style={{ gridArea: "comment" }}>
        <TextInput
          placeholder="Comment"
          name="comment"
          value={comment}
          onChange={newPlaceDataChange}
        />
      </Cell>
      <Cell style={{ gridArea: "normalized-rating" }}>
        <TextInput
          placeholder="Link"
          name="google_maps_link"
          value={google_maps_link}
          onChange={newPlaceDataChange}
        />
      </Cell>
    </>
  );
};
