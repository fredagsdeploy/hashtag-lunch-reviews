import React, { Suspense } from "react";
import { Route, RouteChildrenProps } from "react-router";
import { useRatings } from "../customHooks/api";
import { AddNewPlaceForm } from "./AddNewPlaceForm";
import { Row } from "./CommonFormComponents";
import { LunchModal } from "./modal/Modal";
import { AddNewReviewForm } from "./review/AddNewReviewForm";
import { Spinner } from "./Spinner";
import { StatsView } from "./StatsView";

interface Props extends RouteChildrenProps {
  userId: string;
}

export const StatsController = ({ history, match }: Props) => {
  const ratings = useRatings();

  const onClose = () => {
    history.push("/ratings");
  };

  return (
    <>
      <StatsView ratings={ratings} />
      <Route
        path={`${match!.path}/newreview/:placeId`}
        render={props => (
          <LunchModal onRequestClose={onClose}>
            <Suspense fallback={<Spinner size={"large"} />}>
              <Row>
                <AddNewReviewForm
                  placeId={props.match!.params.placeId}
                  onClose={onClose}
                />
              </Row>
            </Suspense>
          </LunchModal>
        )}
      />
      <Route
        path={`${match!.path}/newplace`}
        render={props => {
          console.log("Statscontrolleprops", props);

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
              <Suspense fallback={<Spinner size={"large"} />}>
                <Row>
                  <AddNewPlaceForm
                    onClose={onClose}
                    initialPlaceInput={initialPlaceInput}
                  />
                </Row>
              </Suspense>
            </LunchModal>
          );
        }}
      />
    </>
  );
};
