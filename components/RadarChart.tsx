import React, { useEffect, useMemo } from "react";
import {
  Canvas,
  Path,
  Group,
  Text,
  vec,
  useFont,
  matchFont,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { RadarChartProps, RadarDataSet, RadarDataPoint } from "@/src/types";
import { lab } from "d3";

const RadarChart: React.FC<RadarChartProps> = ({
  datasets,
  width,
  height,
  maxValue = 100,
  showLabels = true,
  labelColor = "#000000",
  showAxes = true,
  axisColor = "#CCCCCC",
  axisWidth = 1,
  showGrid = true,
  gridCount = 5,
  gridColor = "#EEEEEE",
  gridWidth = 1,
  animated = false,
  animationDuration = 500,
  showValues = true,
  valueColor = "#FFFFFF",
  labelPadding = 25,
  labelFont = matchFont({
    fontFamily: "serif",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  }),
  valueFont = matchFont({
    fontFamily: "serif",
    fontSize: 10,
    fontStyle: "italic",
    fontWeight: "bold",
  }),
}) => {
  const center = useMemo(
    () => ({ x: width / 2, y: height / 2 }),
    [width, height]
  );
  const radius = useMemo(
    () => Math.min(width, height) / 2 - (30 + labelPadding),
    [width, height, labelPadding]
  );

  const axisCount = datasets[0]?.data.length || 0;

  const angleStep = (Math.PI * 2) / axisCount;

  const axisPoints = useMemo(() => {
    return Array.from({ length: axisCount }).map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
        angle,
      };
    });
  }, [axisCount, angleStep, center, radius]);

  const animationProgress = datasets.map(() => useSharedValue(0));

  useEffect(() => {
    if (animated) {
      animationProgress.forEach((progress) => {
        progress.value = 0;
        progress.value = withTiming(1, {
          duration: animationDuration,
          easing: Easing.inOut(Easing.cubic),
        });
      });
    } else {
      animationProgress.forEach((progress) => {
        progress.value = 1;
      });
    }
  }, [animated, animationDuration, datasets, animationProgress]);

  const createDataPath = (dataset: RadarDataSet, progress: number) => {
    "worklet";
    if (dataset.data.length === 0) return "";
    let path = "";

    dataset.data.forEach((point, i) => {
      const normalizedValue = (point.value / maxValue) * progress;
      const angle = i * angleStep - Math.PI / 2;
      const x = center.x + radius * normalizedValue * Math.cos(angle);
      const y = center.y + radius * normalizedValue * Math.sin(angle);

      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        path += ` L ${x},${y}`;
      }
    });
    path += " Z";

    return path;
  };

  const gridPaths = useMemo(() => {
    if (!showGrid) return [];

    return Array.from({ length: gridCount }).map((_, i) => {
      const gridRadius = (radius * (i + 1)) / gridCount;
      let path = "";

      for (let j = 0; j < axisCount; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = center.x + gridRadius * Math.cos(angle);
        const y = center.y + gridRadius * Math.sin(angle);

        if (j === 0) {
          path += `M ${x},${y}`;
        } else {
          path += ` L ${x},${y}`;
        }
      }

      path += " Z";
      return path;
    });
  }, [showGrid, gridCount, radius, axisCount, angleStep, center]);

  const animatedPaths = datasets.map((dataset, index) => {
    return useDerivedValue(() => {
      return createDataPath(dataset, animationProgress[index].value);
    }, [dataset, animationProgress[index]]);
  });

  return (
    <Canvas style={{ width, height }}>
      <Group>
        {showGrid &&
          gridPaths.map((path, i) => (
            <Path
              key={`grid-${i}`}
              path={path}
              style="stroke"
              strokeWidth={gridWidth}
              color={gridColor}
            />
          ))}

        {showAxes &&
          axisPoints.map((point, i) => (
            <Path
              key={`axis-${i}`}
              path={`M ${center.x},${center.y} L ${point.x},${point.y}`}
              style="stroke"
              strokeWidth={axisWidth}
              color={axisColor}
            />
          ))}

        {datasets.map((dataset, i) => (
          <Path
            key={`dataset-${i}`}
            path={animatedPaths[i]}
            style="fill"
            color={dataset.fillColor || "#2196F3"}
            opacity={dataset.opacity || 0.2}
          />
        ))}

        {datasets.map(
          (dataset, i) =>
            dataset.strokeColor && (
              <Path
                key={`dataset-stroke-${i}`}
                path={animatedPaths[i]}
                style="stroke"
                strokeWidth={dataset.strokeWidth || 2}
                color={dataset.strokeColor}
              />
            )
        )}

        {showLabels &&
          datasets[0]?.data.map((point, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = radius + labelPadding;
            const x = center.x + labelRadius * Math.cos(angle);
            const y = center.y + labelRadius * Math.sin(angle);

            let xOffset = 0;
            let yOffset = 0;

            if (Math.abs(angle) < 0.1) {
              yOffset = -labelFont.getSize() / 2;
            } else if (Math.abs(angle - Math.PI) < 0.1) {
              yOffset = labelFont.getSize();
            } else if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
              xOffset = -(5 * (point.label?.length || 0));
            }

            return (
              <Text
                key={`label-${i}`}
                text={point.label || point.key}
                x={x + xOffset}
                y={y + yOffset}
                color={labelColor}
                font={labelFont}
              />
            );
          })}

        {showValues &&
          datasets.map((dataset, datasetIndex) =>
            dataset.data.map((point: any, i: number) => {
              const normalizedValue = point.value / maxValue;
              const angle = i * angleStep - Math.PI / 2;
              const valueText = `${Math.round(point.value)}`;
              const textWidth = valueText.length * (valueFont.getSize() / 2);
              const x = useDerivedValue(
                () =>
                  center.x +
                  radius *
                    normalizedValue *
                    Math.cos(angle) *
                    animationProgress[datasetIndex].value -
                  textWidth / 2
              );
              const y = useDerivedValue(
                () =>
                  center.y +
                  radius *
                    normalizedValue *
                    Math.sin(angle) *
                    animationProgress[datasetIndex].value +
                  valueFont.getSize() / 3
              );

              return (
                <Text
                  key={`value-${datasetIndex}-${i}`}
                  text={valueText}
                  x={x}
                  y={y}
                  color={valueColor}
                  font={valueFont}
                />
              );
            })
          )}
      </Group>
    </Canvas>
  );
};

export default RadarChart;
