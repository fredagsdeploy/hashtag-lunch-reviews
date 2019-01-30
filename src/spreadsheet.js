import config from "./config";

import _ from "lodash";

/**
 * Load the cars from the spreadsheet
 * Get the right values from it and assign.
 */
export function load(callback) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: config.spreadsheetId,
        range: "'Places & Ratings'!A:D"
      })
      .then(
        response => {
          const data = response.result.values;

          const headerRow = _.first(data);
          const dataRows = _.tail(data);

          const formattedData = dataRows.map(row => {
            if (headerRow.length < row.length) {
              console.log("Header row is shorter than row data");
            }

            const formattedRow = {};
            _.zip(headerRow, row).forEach(([key, value]) => {
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
        response => {
          callback(false, response.result.error);
        }
      );
  });
}
