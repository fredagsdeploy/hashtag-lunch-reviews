import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { postPlace } from "../lib/backend";
import { updateRating } from "../store/reducers/ratings";
import { Place, Rating, PlaceInput } from "../types";
import {
  CommentForm,
  FormLabelWrapper,
  Label,
  SaveButton,
  SuggestionItem,
  Suggestions,
  TextArea,
  TextInput
} from "./CommonFormComponents";
import { ModalContainer } from "./ModalContainer";
import { Spinner } from "./Spinner";

interface EditPlaceRowProps {
  onClose: () => void;
  initialPlaceInput: Partial<PlaceInput>;
}

const newPlaceInitialState: PlaceInput = {
  placeName: "",
  comment: "",
  googlePlaceId: ""
};

const getGothenburgCoords = () =>
  // @ts-ignore
  new window.google.maps.LatLng(57.7052778, 11.9648333);

const getSearchOptions = () => ({
  location: getGothenburgCoords(),
  radius: 2000,
  types: ["establishment"]
});

export const AddNewPlaceForm = ({
  onClose,
  initialPlaceInput
}: EditPlaceRowProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPlace, setNewPlace] = useState<PlaceInput>({
    ...newPlaceInitialState,
    ...initialPlaceInput
  });

  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    setIsSubmitting(true);

    postPlace(newPlace)
      .then(
        (rating: Rating) => {
          dispatch(updateRating(rating));
          onClose();
        },
        e => {
          console.log("Couldn't post new place", e);
        }
      )
      .then(() => {
        setIsSubmitting(false);
      });
  };

  const handleNewPlaceInput = (values: Partial<Place>) => {
    setNewPlace(newPlace => ({
      ...newPlace,
      ...values
    }));
  };

  const handleChangeEvent: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    const { name, value } = event.currentTarget;
    handleNewPlaceInput({
      [name]: value
    });
  };

  return (
    <ModalContainer title="Nytt lunchställe" onClose={onClose}>
      <CommentForm onSubmit={handleSubmit}>
        <PlacesAutocomplete
          value={newPlace.placeName}
          searchOptions={getSearchOptions()}
          onChange={placeName => {
            handleNewPlaceInput({
              placeName
            });
          }}
          onSelect={(placeName, googlePlaceId) => {
            handleNewPlaceInput({
              googlePlaceId
            });
            handleNewPlaceInput({
              placeName
            });
          }}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <FormLabelWrapper>
              <Label>Googleplats</Label>
              <TextInput
                autoFocus={true}
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
            </FormLabelWrapper>
          )}
        </PlacesAutocomplete>
        <FormLabelWrapper>
          <Label>Namn</Label>
          <TextInput
            placeholder="Namn"
            name="placeName"
            value={newPlace.placeName || ""}
            onChange={handleChangeEvent}
          />
        </FormLabelWrapper>
        <FormLabelWrapper>
          <Label>Beskrivning</Label>
          <TextArea
            placeholder="Lägg till beskrivning"
            name="comment"
            value={newPlace.comment || ""}
            onChange={handleChangeEvent}
          />
        </FormLabelWrapper>
        <SaveButton disabled={isSubmitting}>
          {isSubmitting ? (
            <Row style={{ flex: 1 }}>
              <Row />
              Sparar...
              <Row>
                <Spinner color={"#fff"} />
              </Row>
            </Row>
          ) : (
            "Spara"
          )}
        </SaveButton>
      </CommentForm>
    </ModalContainer>
  );
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
