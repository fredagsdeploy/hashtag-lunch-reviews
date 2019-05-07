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
    const c = generateColor("#00FF00", "#FF0000", 5);
    ratings.forEach(r => {
      if (!r.googlePlace) {
        return;
      }

      const icon = {
        path:
          "M0 0a10 10 0 0 0-10 10c0 9 10 20 10 20s10-11 10-20a10 10 0 0 0-10-10zm0 12a2 2 0 1 1 2-2 2 2 0 0 1-2 2z",
        fillColor: `#${c[Math.floor(r.normalizedRating)]}`,
        fillOpacity: 1,
        anchor: new window.google.maps.Point(0, 35),
        strokeWeight: 0,
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

function hex(c: any) {
  const s = "0123456789abcdef";
  let i = parseInt(c);
  if (i === 0 || isNaN(c)) return "00";
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb: any) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s: string) {
  return s.charAt(0) === "#" ? s.substring(1, 7) : s;
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hex: string) {
  const color = [];
  color[0] = parseInt(trim(hex).substring(0, 2), 16);
  color[1] = parseInt(trim(hex).substring(2, 4), 16);
  color[2] = parseInt(trim(hex).substring(4, 6), 16);
  return color;
}

function generateColor(
  colorStart: string,
  colorEnd: string,
  colorCount: number
) {
  // The beginning of your gradient
  const start = convertToRGB(colorStart);

  // The end of your gradient
  const end = convertToRGB(colorEnd);

  // The number of colors to compute
  const len = colorCount;

  //Alpha blending amount
  let alpha = 0.0;

  const saida = [];

  for (let i = 0; i < len; i++) {
    const c = [];
    alpha += 1.0 / len;

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.push(convertToHex(c));
  }

  return saida;
}
