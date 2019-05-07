
import React from 'react'
import {MapController} from "./MapController";
import {useRatings} from "../customHooks/api";
import {RouteChildrenProps} from "react-router";

interface Props extends RouteChildrenProps {

}

export const MapPage: React.FC<Props> = (props) => {
    const ratings = useRatings();


    const locations = ratings.filter(r => r.googlePlace).map(r => r.googlePlace!.geometry.location);
    const lats = locations.map(({lat}) => lat);
    const lngs = locations.map(({lng}) => lng);

    console.log(lats);
    console.log(lngs);

    const south = Math.min(...lats);
    const north = Math.max(...lats);
    const east = Math.max(...lngs);
    const west = Math.min(...lngs);
    console.log({south, north, east ,west});
    return <MapController {...props} ratings={ratings} bounds={{east, north, south, west}} />
};