import React, { useEffect } from "react";
import { Canvas, Group, matchFont } from "@shopify/react-native-skia";
import { useChartContext } from "./CartesianChart";
import type { BarChartProps } from "../types";
import {
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import * as d3 from "d3";
import BarPath from "./BarPath";

const BarChart: React.FC<BarChartProps> = ({
  data,
  barColor = ["#000000", "#FFFFFF"],
  barWidth,
  spacing = 0.3,
  animated = false,
  animationDuration = 500,
  animationDelay = 0,
  horizontal = false,
  labelPadding = 20,
  font = matchFont({
    fontFamily: "serif",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  }),
}) => {
  const { innerWidth, innerHeight, xScale, yScale } = useChartContext();

  const barAnimation = useSharedValue(0);
  const textAnimation = useSharedValue(0);

  const effectiveInnerHeight = innerHeight - (horizontal ? 0 : labelPadding);
  const effectiveInnerWidth = innerWidth - (horizontal ? labelPadding : 0);

  const calculatedBarWidth = horizontal
    ? (effectiveInnerHeight / data.length) * (1 - spacing)
    : (effectiveInnerWidth / data.length) * (1 - spacing);

  const colorScale = d3.scaleLinear(
    [0, Math.max(...data.map((d) => d.y))],
    [...barColor]
  );

  console.log(barColor);

  useEffect(() => {
    if (animated) {
      barAnimation.value = 0;
      textAnimation.value = 0;

      barAnimation.value = withDelay(
        animationDelay,
        withTiming(
          1,
          {
            duration: animationDuration,
            easing: Easing.bounce,
          },
          (finished) => {
            if (finished) {
              textAnimation.value = withTiming(1, {
                duration: animationDuration,
              });
            }
          }
        )
      );
    } else {
      barAnimation.value = 1;
      textAnimation.value = 1;
    }
  }, [animated, animationDuration, data]);

  return (
    <Canvas style={{ width: innerWidth, height: innerHeight }}>
      {data.map((item, index) => {
        const x = horizontal ? xScale(item.y) : xScale(item.x);
        const y = horizontal ? yScale(item.x) : yScale(item.y);

        return (
          <Group key={`bar-group-${index}`}>
            <BarPath
              x={x}
              y={y}
              barWidth={barWidth || calculatedBarWidth}
              progress={barAnimation}
              graphHeight={effectiveInnerHeight}
              label={item.y.toString()}
              value={item.y}
              horizontal={horizontal}
              color={colorScale(item.y) || "#FFFFFF"}
              font={font}
            />
          </Group>
        );
      })}
    </Canvas>
  );
};

export default BarChart;
