import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef
} from "react";
import styled from "styled-components";
import { useMedia } from "../customHooks/useMedia";
import hollowStar from "../images/star-regular.svg";
import star from "../images/star-solid.svg";
import { formatStarRating } from "./utils/formatter";

interface Props {
  rating: number;
  onChange: (rating: number) => void;
  defaultSize?: number;
  mediaSize?: number;
}

const clamp = (num: number, max: number, min: number) =>
  Math.max(min, Math.min(max, num));

export const StarRating = ({
  rating,
  onChange,
  defaultSize,
  mediaSize
}: Props) => {
  const mouseDown = useRef(false);

  const starClickHandler = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    const posX = "clientX" in event ? event.clientX : event.touches[0].clientX;
    const container = event.currentTarget as HTMLDivElement;
    const newRating =
      clamp((posX - container.offsetLeft) / container.offsetWidth, 1, 0) * 5;

    if (onChange) {
      onChange(newRating);
    }
  };

  useEffect(() => {
    const handler = () => (mouseDown.current = false);
    window.addEventListener("mouseup", handler);
    window.addEventListener("touchend", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
      window.removeEventListener("touchend", handler);
    };
  }, []);

  return (
    <StarRatingView
      onClick={starClickHandler}
      onMouseDown={() => (mouseDown.current = true)}
      onMouseMove={e => mouseDown.current && starClickHandler(e)}
      onTouchStart={() => (mouseDown.current = true)}
      onTouchMove={e => mouseDown.current && starClickHandler(e)}
      rating={rating}
      defaultSize={defaultSize}
      mediaSize={mediaSize}
      showValue
    />
  );
};

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface StarRatingViewProps {
  rating: number;
  showValue?: boolean;
  defaultSize?: number;
  mediaSize?: number;
}

export const StarRatingView = ({
  rating,
  showValue = false,
  defaultSize = 16,
  mediaSize = 32,
  ...props
}: StarRatingViewProps & DivProps) => {
  const starSize = useMedia(["(max-width: 600px)"], [mediaSize], defaultSize);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div
        style={{ width: 5 * starSize, height: starSize, touchAction: "none" }}
        {...props}
      >
        <StarDiv style={{ width: rating * starSize }} size={starSize} />
        <HollowStarDiv style={{ width: 5 * starSize }} size={starSize} />
      </div>
      {showValue && formatStarRating(rating)}
    </div>
  );
};

const Star = styled.div<{ size: number }>`
  background-repeat: repeat-x;
  background-size: ${props => props.size}px;
  height: ${props => props.size}px;
  position: absolute;
  color: #f8c51c;
`;

const StarDiv = styled(Star)`
  background-image: url(${star});
  z-index: 1;
`;

const HollowStarDiv = styled(Star)`
  background-image: url(${hollowStar});
  z-index: 0;
`;
