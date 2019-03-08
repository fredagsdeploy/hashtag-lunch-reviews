import config from "../config";
import _ from "lodash";
import { Place, Rating } from "../types";
import { googleApiFetcher } from "../useGoogleAuth";

interface Response {
  result: any;
}

interface ErrorResponse {
  result: any;
}

export async function getRatings() {
  await window.gapi.client.load("sheets", "v4");

  return window.gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: config.spreadsheetId,
      range: "place_with_rating_data_output!A:F"
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
                formattedRow[key] = NaN;
              } else {
                formattedRow[key] = parseFloat(value.replace(",", "."));
              }
            } else if (key === "normalized_rating") {
              if (!value) {
                formattedRow[key] = NaN;
              } else {
                formattedRow[key] = parseFloat(value.replace(",", "."));
              }
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

export const getReviewsForPlace = async (placeId: number) => {
  await window.gapi.client.load("sheets", "v4");

  const response: Response = await window.gapi.client.sheets.spreadsheets.values.batchGetByDataFilter(
    {
      spreadsheetId: config.spreadsheetId, // TODO: Update placeholder value.
      resource: {
        dataFilters: [
          {
            gridRange: "reviews_input!A:E"
          }
        ]
      }
    }
  );
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
          formattedRow[key] = NaN;
        } else {
          formattedRow[key] = parseFloat(value.replace(",", "."));
        }
      } else if (key === "normalized_rating") {
        if (!value) {
          formattedRow[key] = NaN;
        } else {
          formattedRow[key] = parseFloat(value.replace(",", "."));
        }
      } else {
        formattedRow[key] = value;
      }
    });

    return formattedRow;
  });

  return formattedData;
};

const formatPlaceForRequest = (place: Place): Array<Array<any>> => [
  [null, place.name, place.comment, place.google_maps_link]
];

export const postPlace = async (place: Place): Promise<Rating> => {
  const postRange = "places!A:D";
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
