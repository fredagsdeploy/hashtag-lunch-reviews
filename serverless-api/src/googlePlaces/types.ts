export interface GooglePlacesResponse {
  html_attributions: any[];
  result: GooglePlaceResult;
  status: string;
}

export interface GooglePlaceResult {
  formatted_address: string;
  types: string[];
  website: string;
  icon: string;
  address_components: Addresscomponent[];
  photos: Photo[];
  url: string;
  scope: string;
  name: string;
  opening_hours: Openinghours;
  geometry: Geometry;
  vicinity: string;
  id: string;
  adr_address: string;
  plus_code: Pluscode;
  place_id: string;
}

interface Pluscode {
  compound_code: string;
  global_code: string;
}

interface Geometry {
  viewport: Viewport;
  location: Southwest;
}

interface Viewport {
  southwest: Southwest;
  northeast: Southwest;
}

interface Southwest {
  lng: number;
  lat: number;
}

interface Openinghours {
  open_now: boolean;
  periods: Period[];
  weekday_text: string[];
}

interface Period {
  close: Close;
  open: Close;
}

interface Close {
  day: number;
  time: string;
}

interface Photo {
  width: number;
  html_attributions: string[];
  photo_reference: string;
  height: number;
}

interface Addresscomponent {
  long_name: string;
  short_name: string;
  types: string[];
}
