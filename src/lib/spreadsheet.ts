import config from "../config";
import _ from "lodash";

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

        console.log("wha?", formattedData);

        return formattedData;
      },
      (response: ErrorResponse) => {
        throw response.result.error;
      }
    );
}
