import React, { useMemo } from "react";
import { useSpring, interpolate, animated } from "react-spring";
import { zip } from "lodash";
import _ from "lodash";

interface DiagDataItem {
  value: number;
  max: number;
}

type DiagData = DiagDataItem[];
type Point2D = [number, number];
type Points2D = Point2D[];

export const getRandomData = (len: number): DiagData =>
  _.range(len).map(() => ({ value: Math.random() * 10, max: 10 }));

const getEmptyData = (len: number) =>
  _.range(len).map(() => ({ value: 0, max: 10 }));

const scaleData = (
  data: DiagData,
  outterPoints: Points2D,
  radius: number,
  centerX: number,
  centerY: number
) => {
  return data.map(({ value, max }, i) => [
    centerX + (value / max) * outterPoints[i][0] * radius,
    centerY + (value / max) * outterPoints[i][1] * radius
  ]);
};

const joinPoints = (points: Array<[number, number]>) =>
  points.map(pts => pts.join(",")).join(" ");

interface Props {
  data: DiagData;
  lineColor?: string;
  areaColor?: string;
  radius?: number;
  width?: number;
  height?: number;
}

export const SpiderWebChart: React.FC<Props> = ({
  lineColor = "#5D5D5F",
  areaColor = "#6495ed55",
  radius = 60,
  width = 160,
  height = 160,
  data
}) => {
  const centerX = width / 2;
  const centerY = height / 2;

  const dimensions = data.length;
  const emptyData = useMemo(() => getEmptyData(dimensions), [dimensions]);

  const range = _.range(dimensions);

  const outterPoints = useMemo(
    () =>
      range.map<Point2D>(index => [
        Math.cos(((Math.PI * 2) / dimensions) * index - Math.PI / 2),
        Math.sin(((Math.PI * 2) / dimensions) * index - Math.PI / 2)
      ]),
    [dimensions]
  );

  const spring = useSpring<{ xs: number[]; ys: number[] }>({
    // @ts-ignore
    from: useMemo(
      () => ({
        xs: scaleData(emptyData, outterPoints, radius, centerX, centerY).map(
          d => d[0]
        ),
        ys: scaleData(emptyData, outterPoints, radius, centerX, centerY).map(
          d => d[1]
        )
      }),
      [emptyData, outterPoints, radius, centerX, centerY]
    ),
    to: useMemo(
      () => ({
        xs: scaleData(data, outterPoints, radius, centerX, centerY).map(
          d => d[0]
        ),
        ys: scaleData(data, outterPoints, radius, centerX, centerY).map(
          d => d[1]
        )
      }),
      [data, outterPoints, radius, centerX, centerY]
    )
  });

  return (
    <svg width={width} height={height} viewBox="0 0 160 160">
      {outterPoints.map(([x, y], index) => (
        <line
          key={index}
          x1={centerX}
          y1={centerY}
          x2={centerX + x * radius}
          y2={centerY + y * radius}
          stroke={lineColor}
          fill="none"
        />
      ))}
      {range.map(i => (
        <line
          key={i}
          x1={centerX + outterPoints[i][0] * radius}
          y1={centerY + outterPoints[i][1] * radius}
          x2={centerX + outterPoints[(i + 1) % dimensions][0] * radius}
          y2={centerY + outterPoints[(i + 1) % dimensions][1] * radius}
          stroke={lineColor}
          fill="none"
        />
      ))}
      {range.map(i => (
        <line
          key={i}
          x1={centerX + outterPoints[i][0] * radius}
          y1={centerY + outterPoints[i][1] * radius}
          x2={centerX + outterPoints[(i + 1) % dimensions][0] * radius}
          y2={centerY + outterPoints[(i + 1) % dimensions][1] * radius}
          stroke={lineColor}
          fill="none"
        />
      ))}
      <animated.polygon
        points={interpolate([spring.xs, spring.ys], ((
          xx: number[],
          yy: number[]
        ) => joinPoints(zip(xx, yy) as [number, number][])) as any)}
        fill={areaColor}
        strokeWidth={3}
        stroke={lineColor}
      />
    </svg>
  );
};
