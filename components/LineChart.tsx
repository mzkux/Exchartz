import React, { useEffect, useMemo, useState } from "react";
import {
  Canvas,
  Path,
  Group,
  usePathInterpolation,
  Skia,
} from "@shopify/react-native-skia";
import * as d3 from "d3";
import { useChartContext } from "./CartesianChart";
import { LineChartProps } from "../types";
import {
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const LineChart: React.FC<LineChartProps> = ({
  data,
  lineColor = "#2196F3",
  strokeWidth = 2,
  curve = d3.curveMonotoneX,
  animated = false,
  animationDuration = 500,
  animationDelay = 0,
}) => {
  const { innerWidth, innerHeight, xScale, yScale } = useChartContext();
  const lineProgress = useSharedValue(0);
  const [linePath, setLinePath] = useState(Skia.Path.Make());
  const [prevPath, setPrevPath] = useState(Skia.Path.Make());

  const processedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      scaledX: xScale(d.x),
      scaledY: yScale(d.y),
    }));
  }, [data, xScale, yScale]);

  const createPathFromData = (data: any[]) => {
    if (data.length === 0) return Skia.Path.Make();

    const lineGenerator = d3
      .line<any>()
      .x((d) => d.scaledX)
      .y((d) => d.scaledY)
      .curve(curve);

    const svgPath = lineGenerator(data);

    const skPath = Skia.Path.MakeFromSVGString(svgPath || "");

    if (skPath) {
      return skPath;
    } else {
      const path = Skia.Path.Make();
      if (data.length > 0) {
        path.moveTo(data[0].scaledX, data[0].scaledY);
        for (let i = 1; i < data.length; i++) {
          path.lineTo(data[i].scaledX, data[i].scaledY);
        }
      }
      return path;
    }
  };

  useEffect(() => {
    const newPath = createPathFromData(processedData);

    if (linePath.isEmpty() || processedData.length !== data.length) {
      setPrevPath(newPath);
      setLinePath(newPath);
    } else {
      setPrevPath(linePath);
      setLinePath(newPath);
    }

    if (animated) {
      lineProgress.value = 0;
      lineProgress.value = withDelay(
        animationDelay,
        withTiming(1, {
          duration: animationDuration,
          easing: Easing.inOut(Easing.cubic),
        })
      );
    } else {
      lineProgress.value = 1;
    }
  }, [processedData, animated, animationDelay, animationDuration]);

  const animatedPath = usePathInterpolation(
    lineProgress,
    [0, 1],
    [prevPath, linePath]
  );

  return (
    <Canvas
      style={{ width: innerWidth, height: innerHeight, position: "absolute" }}
    >
      <Group>
        <Path
          path={animatedPath}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeJoin="round"
          strokeCap="round"
          color={lineColor}
        />
      </Group>
    </Canvas>
  );
};

export default LineChart;
