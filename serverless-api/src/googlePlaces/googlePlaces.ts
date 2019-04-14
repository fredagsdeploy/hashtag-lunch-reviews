import fetch from "node-fetch";
import config from "../../config";

export const getGooglePlace = (googlePlaceId: string) =>
  fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${googlePlaceId}&key=${
      config.googlePlacesApiKey
    }`
  );
