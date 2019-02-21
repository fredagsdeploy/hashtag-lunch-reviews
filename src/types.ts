export interface Rating {
  id: string;
  name: string;
  google_maps_link: string;
  rating: number;
  normalized_rating: number;
  comment: string;
}

export interface Place {
  name: string;
  google_maps_link: string;
  comment: string;
}

export const newPlace = {
  name: "",
  google_maps_link: "",
  comment: ""
};
