import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  KeyboardEventHandler,
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
  mobileSize?: number;
}

const clamp = (num: number, max: number, min: number) =>
  Math.max(min, Math.min(max, num));

const roundValue = (num: number) => Math.round(num * 10) / 10;

export const StarRating = ({
  rating,
  onChange,
  defaultSize,
  mobileSize
}: Props) => {
  const mouseDown = useRef(false);

  const starClickHandler = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    const posX = "clientX" in event ? event.clientX : event.touches[0].clientX;
    const container = event.currentTarget as HTMLDivElement;
    const newRating = roundValue(
      clamp((posX - container.offsetLeft) / container.offsetWidth, 1, 0) * 5
    );

    if (onChange) {
      onChange(newRating);
    }
  };

  const handleKeyDown: KeyboardEventHandler = e => {
    switch (e.key) {
      case "ArrowLeft":
        onChange(clamp(rating - 0.1, 5, 0));
        break;
      case "ArrowRight":
        onChange(clamp(rating + 0.1, 5, 0));
        break;
      default:
        return;
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
      onKeyDown={handleKeyDown}
      onMouseDown={() => (mouseDown.current = true)}
      onMouseMove={e => mouseDown.current && starClickHandler(e)}
      onTouchStart={() => (mouseDown.current = true)}
      onTouchMove={e => mouseDown.current && starClickHandler(e)}
      rating={rating}
      defaultSize={defaultSize}
      mobileSize={mobileSize}
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
  mobileSize?: number;
}

export const StarRatingView = ({
  rating,
  showValue = false,
  defaultSize = 16,
  mobileSize = 32,
  ...props
}: StarRatingViewProps & DivProps) => {
  const starSize = useMedia(["(max-width: 600px)"], [mobileSize], defaultSize);

  return (
    <div
      style={{
        userSelect: "none"
      }}
    >
      <div
        style={{ width: 5 * starSize, height: starSize, touchAction: "none" }}
        tabIndex={0}
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
