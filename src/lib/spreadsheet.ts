import config from "../config";
import _ from "lodash";
import { Place, Rating } from "../types";

interface Response {
  result: any;
}

interface ErrorResponse {
  result: any;
}

export const initSpreadsheetApi = async () => {
  await window.gapi.load("client", () => {
    window.gapi.client.init({
      apiKey: config.apiKey,
      discoveryDocs: config.discoveryDocs
    });
  });
  return window.gapi.client.load("sheets", "v4");
};

export async function getRatings() {
  return window.gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: config.spreadsheetId,
      range: "'Places & Ratings'!A:D"
    })
    .then(
      (response: Response) => {
        const data = response.result.values;

        const headerRow: Array<string> | undefined = _.first(data);
        const dataRows: Array<Array<string>> = _.tail(data);

        if (!headerRow) {
          throw new Error("No data received, is the spreadsheet empty?");
        }

        const formattedData = dataRows.map(row => {
          if (headerRow.length < row.length) {
            console.log("Header row is shorter than row data");
          }

          const formattedRow: {
            [key: string]: number | string | undefined;
          } = {};

          _.zip(headerRow, row).forEach(([key, value]) => {
            if (!key) {
              throw new Error(`Key: ${key}`);
            }
            if (key === "rating") {
              if (!value) {
                throw new Error(`Bad value: ${value}`);
              }
              formattedRow[key] = parseFloat(value.replace(",", "."));
            } else {
              formattedRow[key] = value;
            }
          });

          return formattedRow;
        });

        return formattedData;
      },
      (response: ErrorResponse) => {
        throw response.result.error;
      }
    );
}

const formatPlaceForRequest = (place: Place): Array<Array<any>> => [
  [place.name, null, place.comment, place.google_maps_link]
];

export const postPlace = async (place: Place): Promise<Rating> => {
  const postRange = "Places & Ratings!A:D";
  return window.gapi.client.sheets.spreadsheets.values
    .append(
      {
        spreadsheetId: config.spreadsheetId,
        range: postRange,
        valueInputOption: "RAW"
      },
      {
        range: postRange,
        majorDimension: "ROWS",
        values: formatPlaceForRequest(place)
      }
    )
    .then((resp: Response) => {
      console.log("success?", resp);
      return place;
    });
};
