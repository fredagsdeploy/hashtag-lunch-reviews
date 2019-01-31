import config from "./config";
import _ from "lodash";

interface Response {
  result: any;
}

interface ErrorResponse {
  result: any;
}

export function load(callback: (data: any, error?: Error) => void) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
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

            const formattedRow: { [key: string]: number | string } = {};
            _.zip(headerRow, row).forEach(([key, value]) => {
              if (!key || !value) {
                throw new Error("");
              }
              if (key === "rating") {
                formattedRow[key] = parseFloat(value.replace(",", "."));
              } else {
                formattedRow[key] = value;
              }
            });

            return formattedRow;
          });

          callback(formattedData);
        },
        (response: ErrorResponse) => {
          callback(false, response.result.error);
        }
      );
  });
}
