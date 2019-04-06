import React, { useState } from "react";
import { Place } from "../types";
import { Cell, TextInput, WhiteRow } from "./CommonFormComponents";
import PlacesAutocomplete from "react-places-autocomplete";

interface EditPlaceRowProps {
  placeData: Partial<Place>;
  newPlaceDataChange: Function;
}

export const AddNewPlaceForm = ({
  placeData,
  newPlaceDataChange
}: EditPlaceRowProps) => {
  const { placeName, comment } = placeData;
  if (placeName === undefined) {
    throw new Error(
      `Missing members in place data ${JSON.stringify(placeData)}`
    );
  }

  return (
    <>
      <Cell style={{ gridArea: "rating" }}>
        <TextInput
          placeholder="Comment"
          name="comment"
          value={comment ? comment : ""}
          onChange={newPlaceDataChange}
        />
      </Cell>
      <Cell style={{ gridArea: "comment" }}>
        <PlacesAutocomplete
          value={placeName}
          onChange={value => {
            newPlaceDataChange({
              target: { name: "placeName", value: value }
            });
          }}
          onSelect={(placeName, googlePlaceId) => {
            newPlaceDataChange({
              target: { name: "googlePlaceId", value: googlePlaceId }
            });
            newPlaceDataChange({
              target: { name: "placeName", value: placeName }
            });
          }}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input"
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </Cell>
    </>
  );
};
