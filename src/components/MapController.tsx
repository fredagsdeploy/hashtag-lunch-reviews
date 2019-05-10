import React, { Suspense, useEffect, useRef, useState } from "react";
import config from "../config";
import { Rating } from "../types";
import styled from "styled-components";
import { ModalContainer } from "./ModalContainer";
import { StarRating } from "./StarRating";
import { Link, Route, Switch } from "react-router-dom";
import { LunchModal } from "./modal/Modal";
import { Spinner } from "./Spinner";
import { SinglePlaceView } from "./place/SinglePlaceView";
import { RouteChildrenProps } from "react-router";

interface MarkerReviewPair {
  marker: any;
  rating: Rating;
}

interface Props extends RouteChildrenProps {
  options?: {
    center: { lat: number; lng: number };
    zoom: number;
  };
  ratings: Rating[];
  bounds: any;
}

export const MapController: React.FC<Props> = ({
  options = {
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true,
    rotateControl: true,
    fullscreenControl: true
  },
  ratings,
  bounds,
  history,
  match
}) => {
  const props = {
    ref: useRef<HTMLDivElement>(null),
    className: "mapscontroller"
  };
  const mapRef = useRef(null);
  const onLoad = () => {
    const map = new window.google.maps.Map(props.ref.current, options);
    mapRef.current = map;
    map.fitBounds(bounds);
  };

  const [activeMarker, setActiveMarker] = useState<any | null>(null);
  const previousActiveMarker = useRef<any>(null);
  useEffect(() => {
    if (previousActiveMarker.current) {
      previousActiveMarker.current.marker.setAnimation(null);
    }
    if (activeMarker) {
      activeMarker.marker.setAnimation(window.google.maps.Animation.BOUNCE);
    }
  }, [activeMarker]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement(`script`);
      script.type = `text/javascript`;
      script.src = `https://maps.google.com/maps/api/js?key=` + config.apiKey;
      const headScript = document.getElementsByTagName(`script`)[0];
      headScript.parentNode!.insertBefore(script, headScript);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const poor = "#9d9d9d";
    const common = "#ffffff";
    const uncommon = "#1eff00";
    const rare = "#0070dd";
    const epic = "#a335ee";
    const legendary = "#ff8000";

    const c = [poor, common, uncommon, rare, epic, legendary];

    ratings.forEach(r => {
      if (!r.googlePlace) {
        return;
      }

      const icon = {
        path:
          "M0 0a10 10 0 0 0-10 10c0 9 10 20 10 20s10-11 10-20a10 10 0 0 0-10-10zm0 12a2 2 0 1 1 2-2 2 2 0 0 1-2 2z",
        strokeColor: "#000",
        strokeOpacity: 1,
        fillColor: `${c[Math.round(r.normalizedRating)]}`,
        fillOpacity: 1,
        anchor: new window.google.maps.Point(0, 35),
        strokeWeight: 1,
        scale: 1
      };
      let marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: r.googlePlace!.geometry.location,
        title: r.placeName,
        icon
      });
      marker.addListener("click", function() {
        setActiveMarker((prevMarker: any) => {
          history.push(`${match!.path}/${r.placeId}/summary`);
          previousActiveMarker.current = prevMarker;
          return { marker, rating: r };
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratings]);

  const onClose = () => {
    history.push("/map");
  };

  const setNoMark = () =>
    setActiveMarker((prevMarker: any) => {
      previousActiveMarker.current = prevMarker;
      onClose();
      return null;
    });

  return (
    <div>
      <Switch>
        <Route path={`${match!.path}/:placeId/summary`}>
          <RatingSummary
            rating={activeMarker ? activeMarker.rating : null}
            onSummaryClose={setNoMark}
          />
        </Route>
        <Route
          path={`${match!.path}/:placeId`}
          render={props => (
            <LunchModal onRequestClose={onClose}>
              <Suspense fallback={<Spinner size={"large"} />}>
                <SinglePlaceView
                  placeId={props.match!.params.placeId}
                  onClose={setNoMark}
                />
              </Suspense>
            </LunchModal>
          )}
        />
      </Switch>
      <div
        {...props}
        style={{ height: `70vh`, margin: `1em 0`, borderRadius: `0.5em` }}
      />
    </div>
  );
};

interface RatingSummaryProps {
  rating: Rating;
  onSummaryClose: () => void;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  rating,
  onSummaryClose
}) => {
  if (!rating) {
    return <></>;
  }
  return (
    <ModalContainerAbsolute
      title={<Link to={`/map/${rating.placeId}`}>{rating.placeName}</Link>}
      onClose={onSummaryClose}
    >
      <StarRating rating={rating.rating} onChange={() => {}} />
    </ModalContainerAbsolute>
  );
};

const ModalContainerAbsolute = styled(ModalContainer)`
  position: absolute;
  z-index: 1;
  width: 100%;
  max-width: 800px;
`;
