import config from "../config";

export const getPhotoUrl = (googlePlace: any) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${
    googlePlace.photos[0].photo_reference
  }&key=${config.apiKey}`;
