import React from "react";
import { PlaceView } from "./PlaceView";
import { RouteChildrenProps } from "react-router";

interface Props extends RouteChildrenProps<{ placeId: string }> {}

export const PlaceController = ({ match }: Props) => {
  if (!match) {
    return null;
  }

  const { placeId } = match.params;

  return <PlaceView placeId={placeId} />;
};
