import React, { useEffect, useRef } from "react";
import config from "../config";
import { Rating } from "../types";

interface Props {
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
  bounds
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
  });

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    ratings.forEach(r => {
      if (!r.googlePlace) {
        return;
      }
      new window.google.maps.Marker({
        map: mapRef.current,
        position: r.googlePlace!.geometry.location,
        title: r.placeName
      });
    });
  }, [ratings]);

  return (
    <div
      {...props}
      style={{ height: `70vh`, margin: `1em 0`, borderRadius: `0.5em` }}
    />
  );
};
