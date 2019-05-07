import { faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  size?: "large" | "small";
  color?: string;
  padding?: string;
}

export const Spinner = ({ size = "small", color = "#5d5d5d", padding = "0" }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding
      }}
    >
      <FontAwesomeIcon
        icon={faUtensilSpoon}
        spin
        size={size === "large" ? "6x" : "1x"}
        color={color}
      />
    </div>
  );
};
