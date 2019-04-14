import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";

interface Props {
  size?: "large" | "small";
}

export const Spinner = ({ size = "small" }: Props) => {
  return (
    <FontAwesomeIcon
      icon={faUtensilSpoon}
      spin
      size={size == "large" ? "3x" : "1x"}
      color={"#5d5d5d"}
    />
  );
};
