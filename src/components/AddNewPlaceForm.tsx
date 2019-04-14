import React, { useState } from "react";
import { Place } from "../types";
import { Cell, TextInput, WhiteRow } from "./CommonFormComponents";
import PlacesAutocomplete from "react-places-autocomplete";
import styled from "styled-components";

interface EditPlaceRowProps {
  placeData: Partial<Place>;
  newPlaceDataChange: Function;
}

export const AddNewPlaceForm = ({
  placeData,
  newPlaceDataChange
}: EditPlaceRowProps) => {
  const { placeName, comment } = placeData;

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
              <Suggestions>
                {loading && <SuggestionItem>Loading...</SuggestionItem>}
                {suggestions.map(suggestion => {
                  return (
                    <SuggestionItem
                      key={suggestion.id}
                      {...getSuggestionItemProps(suggestion)}
                    >
                      {suggestion.description}
                    </SuggestionItem>
                  );
                })}
              </Suggestions>
            </div>
          )}
        </PlacesAutocomplete>
      </Cell>
    </>
  );
};

const Suggestions = styled.div`
  position: absolute;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  border-radius: 24px;
  background-color: #fff;
`;

const SuggestionItem = styled.div`
  padding: 0.4em 1em;
  cursor: pointer;
  border-radius: 24px;

  &:hover {
    background-color: #eee;
  }
`;
