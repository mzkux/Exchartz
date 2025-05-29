import React, { useEffect, useMemo, useState } from "react";
import {
  Canvas,
  Circle,
  Group,
  matchFont,
  Text,
} from "@shopify/react-native-skia";
import { useChartContext } from "./CartesianChart";
import { ScatterChartProps } from "../types";
import {
  useSharedValue,
  useDerivedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const Scatter: React.FC<ScatterChartProps> = ({
  data,
  dotColor = "#2196F3",
  dotRadius = 5,
  animated = false,
  animationDuration = 500,
  animationDelay = 0,
  font = matchFont({
    fontFamily: "serif",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  }),
}) => {
  const { innerWidth, innerHeight, xScale, yScale } = useChartContext();
  const animationProgress = useSharedValue(animated ? 0 : 1);
  const [prevData, setPrevData] = useState<any[]>([]);

  const processedData = useMemo(() => {
    return data.map((d) => {
      let size = dotRadius;

      return {
        ...d,
        scaledX: xScale(d.x),
        scaledY: yScale(d.y),
        value: d.y,
        pointSize: size,
        pointColor: d.color || dotColor,
      };
    });
  }, [data, xScale, yScale, dotRadius, dotColor]);

  useEffect(() => {
    if (animated) {
      animationProgress.value = 0;
      animationProgress.value = withDelay(
        animationDelay,
        withTiming(1, {
          duration: animationDuration,
          easing: Easing.inOut(Easing.cubic),
        })
      );
    } else {
      animationProgress.value = 1;
    }
    return () => {
      setPrevData(processedData);
    };
  }, [data, animated, animationDelay, animationDuration]);

  const getAnimatedY = (point: any) => {
    const prevPoint = prevData.find((p) => p.x === point.x);
    const prevY = prevPoint ? prevPoint.scaledY : innerHeight;
    return useDerivedValue(
      () => prevY + (point.scaledY - prevY) * animationProgress.value
    );
  };

  const getTextY = (point: any) => {
    return useDerivedValue(() => {
      const prevPoint = prevData.find((p) => p.x === point.x);
      const prevY = prevPoint ? prevPoint.scaledY : innerHeight;
      return prevY + (point.scaledY - prevY) * animationProgress.value - 10;
    });
  };

  return (
    <Canvas
      style={{ width: innerWidth, height: innerHeight, position: "absolute" }}
    >
      <Group>
        {processedData.map((point, index) => {
          const textWidth = font
            ? font.getTextWidth(point.value.toFixed(1))
            : 0;

          return (
            <Group key={index}>
              <Circle
                key={index}
                cx={point.scaledX}
                cy={getAnimatedY(point)}
                r={dotRadius}
                color={point.color || dotColor}
              />
              <Text
                key={`barText-${index}`}
                text={point.value.toFixed(1)}
                x={point.scaledX - textWidth / 2}
                y={getTextY(point)}
                color={"#FFFFFF"}
                font={font}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
};

export default Scatter;
