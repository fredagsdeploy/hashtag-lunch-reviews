import { faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  size?: "large" | "small";
}

export const Spinner = ({ size = "small" }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <FontAwesomeIcon
        icon={faUtensilSpoon}
        spin
        size={size == "large" ? "3x" : "1x"}
        color={"#5d5d5d"}
      />
    </div>
  );
};
