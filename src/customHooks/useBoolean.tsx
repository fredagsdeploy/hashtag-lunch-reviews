import React, { useState, useCallback } from "react";

export type useBoolean = (
  initialState: boolean
) => [boolean, (nextValue?: boolean) => void, (asd: any) => void];

export const useBoolean: useBoolean = (initialState: boolean) => {
  const [value, setValue] = useState<boolean>(initialState);
  const toggler = useCallback(() => setValue(value => !value), [setValue]);
  return [value, toggler, setValue];
};
