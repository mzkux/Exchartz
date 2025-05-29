import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Canvas,
  Path,
  Group,
  Text as SkiaText,
  useFont,
  vec,
  Skia,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";

interface SpeedometerProps {
  maxSpeed?: number;
  currentSpeed?: number;
  width?: number;
  height?: number;
}

export default function SpeedMeter({
  maxSpeed = 180,
  currentSpeed = 0,
  width = 300,
  height = 300,
}: SpeedometerProps) {
  const animatedSpeed = useSharedValue(0);
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 24);

  useEffect(() => {
    animatedSpeed.value = withTiming(currentSpeed, { duration: 500 });
  }, [currentSpeed]);

  if (!font) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  const startAngle = Math.PI * 0.8;
  const endAngle = Math.PI * 2.2;
  const angleRange = endAngle - startAngle;

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: centerX - radius,
        y: centerY - radius,
        width: radius * 2,
        height: radius * 2,
      },
      startAngle * (180 / Math.PI),
      (endAngle - startAngle) * (180 / Math.PI)
    );
    return path;
  };

  const createTicks = () => {
    const ticks = [];
    const tickCount = 18;

    for (let i = 0; i <= tickCount; i++) {
      const angle = startAngle + (i / tickCount) * angleRange;
      const isLargeTick = i % 2 === 0;
      const tickLength = isLargeTick ? 15 : 7;

      const innerX = centerX + (radius - tickLength) * Math.cos(angle);
      const innerY = centerY + (radius - tickLength) * Math.sin(angle);
      const outerX = centerX + radius * Math.cos(angle);
      const outerY = centerY + radius * Math.sin(angle);

      const path = Skia.Path.Make();
      path.moveTo(innerX, innerY);
      path.lineTo(outerX, outerY);

      ticks.push(
        <Path
          key={i}
          path={path}
          color={getTickColor(i / tickCount)}
          style="stroke"
          strokeWidth={isLargeTick ? 3 : 1.5}
        />
      );

      if (isLargeTick) {
        const labelRadius = radius - 30;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);
        const value = Math.round((i / tickCount) * maxSpeed);

        ticks.push(
          <SkiaText
            key={`label-${i}`}
            font={font}
            text={`${value}`}
            x={labelX}
            y={labelY}
            color="#FFFFFF"
            opacity={0.7}
            origin={vec(labelX, labelY)}
          />
        );
      }
    }

    return ticks;
  };

  const getTickColor = (position: number) => {
    if (position < 0.6) return "#4CAF50"; // Green
    if (position < 0.8) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };

  const createNeedle = (speed: number) =>
    useDerivedValue(() => {
      const percentage = Math.min(speed / maxSpeed, 1);
      const angle = startAngle + percentage * angleRange;

      const needleLength = radius - 20;
      const needleTailLength = 20;

      const tipX = centerX + needleLength * Math.cos(angle);
      const tipY = centerY + needleLength * Math.sin(angle);
      const tailX = centerX - needleTailLength * Math.cos(angle);
      const tailY = centerY - needleTailLength * Math.sin(angle);

      const path = Skia.Path.Make();
      path.moveTo(tailX, tailY);
      path.lineTo(tipX, tipY);

      return path;
    });

  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }}>
        <Path
          path={createArc(startAngle, endAngle, radius)}
          color="#333333"
          style="stroke"
          strokeWidth={10}
        />

        <Group>{createTicks()}</Group>

        <Path
          path={createNeedle(animatedSpeed.value)}
          color="#FF5252"
          style="stroke"
          strokeWidth={4}
          strokeJoin="round"
          strokeCap="round"
        />

        <Group>
          <Path
            path={Skia.Path.Make().addCircle(centerX, centerY, 15)}
            color="#FF5252"
          />
          <Path
            path={Skia.Path.Make().addCircle(centerX, centerY, 10)}
            color="#333333"
          />
        </Group>

        <SkiaText
          font={font}
          text={`${Math.round(animatedSpeed.value)}`}
          x={centerX}
          y={centerY + radius / 2}
          color="#FFFFFF"
          origin={vec(centerX, centerY + radius / 2)}
        />

        <SkiaText
          font={font}
          text="km/h"
          x={centerX}
          y={centerY + radius / 2 + 30}
          color="#AAAAAA"
          origin={vec(centerX, centerY + radius / 2 + 30)}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
