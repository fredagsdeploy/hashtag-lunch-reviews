import React from "react";
import { Route, RouteChildrenProps, Switch } from "react-router";
import { useRatings } from "../customHooks/api";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import { Row } from "./CommonFormComponents";
import { LunchModal } from "./modal/Modal";
import { SinglePlaceView } from "./place/SinglePlaceView";
import { AddNewReviewForm } from "./review/AddNewReviewForm";
import { StatsView } from "./StatsView";
import { useUserContext } from "../customHooks/useUserContext";

interface Props extends RouteChildrenProps {
  userId: string;
}

export const StatsController = ({ history, match }: Props) => {
  const ratings = useRatings();
  const user = useUserContext();

  const onClose = () => {
    history.push("/ratings");
  };

  return (
    <>
      <StatsView ratings={ratings} />
      <Switch>
        <Route
          path={`${match!.path}/newreview/:placeId`}
          render={props => {
            if (!user) {
              onClose();
            }

            return (
              <LunchModal onRequestClose={onClose}>
                <Row>
                  <AddNewReviewForm
                    placeId={props.match!.params.placeId}
                    onClose={onClose}
                  />
                </Row>
              </LunchModal>
            );
          }}
        />
        <Route
          path={`${match!.path}/newplace`}
          render={props => {
            if (!user) {
              onClose();
            }

            let initialPlaceInput = {
              placeName: "",
              comment: ""
            };

            if (props.location.search) {
              const queryParams = props.location.search.substr(1).split("&");
              initialPlaceInput = queryParams.reduce((acc, next) => {
                const [key, value] = next.split("=");
                return { ...acc, [key]: value };
              }, initialPlaceInput);
            }

            return (
              <LunchModal onRequestClose={onClose}>
                <Row>
                  <AddNewPlaceForm
                    onClose={onClose}
                    initialPlaceInput={initialPlaceInput}
                  />
                </Row>
              </LunchModal>
            );
          }}
        />
        <Route
          path={`${match!.path}/:placeId`}
          render={props => (
            <LunchModal onRequestClose={onClose}>
              <SinglePlaceView
                placeId={props.match!.params.placeId}
                onClose={onClose}
              />
            </LunchModal>
          )}
        />
      </Switch>
    </>
  );
};
