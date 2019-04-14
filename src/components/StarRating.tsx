import React, {
  MouseEventHandler,
  useRef,
  useEffect,
  HTMLAttributes,
  DetailedHTMLProps
} from "react";
import styled from "styled-components";
import _ from "lodash";
import star from "../images/star-solid.svg";
import hollowStar from "../images/star-regular.svg";

interface Props {
  rating: number;
  onChange: (rating: number) => void;
}
const starSize = 16;

export const StarRating = ({ rating, onChange }: Props) => {
  const mouseDown = useRef(false);

  const starClickHandler: MouseEventHandler<HTMLDivElement> = event => {
    const container = event.currentTarget as HTMLDivElement;
    const newRating =
      ((event.clientX - container.offsetLeft) / container.offsetWidth) * 5;

    if (onChange) {
      onChange(newRating);
    }
  };

  useEffect(() => {
    const handler = () => (mouseDown.current = false);
    window.addEventListener("mouseup", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
    };
  }, []);

  return (
    <StarRatingView
      onClick={starClickHandler}
      onDrag={starClickHandler}
      onMouseDown={() => (mouseDown.current = true)}
      onMouseMove={e => mouseDown.current && starClickHandler(e)}
      rating={rating}
    />
  );
};

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const StarRatingView = ({
  rating,
  ...props
}: Pick<Props, "rating"> & DivProps) => {
  return (
    <div style={{ width: 5 * starSize, height: starSize }} {...props}>
      <StarDiv style={{ width: rating * starSize }} />
      <HollowStarDiv style={{ width: 5 * starSize }} />
    </div>
  );
};

const Star = styled.div`
  background-repeat: repeat-x;
  background-size: ${starSize}px;
  height: ${starSize}px;
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
