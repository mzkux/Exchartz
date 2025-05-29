import React, { useEffect } from "react";
import { Canvas, Group, matchFont, useFont } from "@shopify/react-native-skia";
import { pie } from "d3-shape";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import PiArc from "./PiArc";
import type { PieChartProps } from "../types";

const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  animated = false,
  font = matchFont({
    fontFamily: "serif",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  }),
}) => {
  const radius = size / 2;
  const pieData = pie<{ value: number }>().value((d) => d.value)(data);
  const piProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      piProgress.value = 0;
      piProgress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      piProgress.value = 1;
    }
  });

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={[{ translateX: radius }, { translateY: radius }]}>
        {pieData.map((slice, i) => {
          return (
            <Group key={i}>
              <PiArc
                slice={slice}
                i={i}
                data={data}
                radius={radius}
                font={font!}
                progress={piProgress}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
};

export default PieChart;
