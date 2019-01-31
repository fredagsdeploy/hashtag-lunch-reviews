import React, { useState, useCallback } from "react";

export const useSortableTableData = <T>(initialValue: Array<T>) => {
  const [tableData, setTableData] = useState(initialValue);
  const sorter = useCallback((sortKey, order) => {}, []);

  return [tableData, setTableData, sorter];
};
