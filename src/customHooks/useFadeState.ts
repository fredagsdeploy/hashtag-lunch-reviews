import React, { useState, useRef, useCallback } from "react";

export const useFadeState = (
  initialState: boolean,
  delay: number
): [boolean, (value: boolean) => void] => {
  const [state, setState] = useState(initialState);

  const timeout = useRef<number | undefined>(undefined);

  const newSetState = useCallback(
    (newState: boolean) => {
      setState(newState);

      if (timeout.current) {
        window.clearTimeout(timeout.current);
      }

      timeout.current = window.setTimeout(() => {
        setState(!newState);
      }, delay);
    },
    [timeout, setState, delay]
  );

  return [state, newSetState];
};
