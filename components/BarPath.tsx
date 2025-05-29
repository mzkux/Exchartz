// BarPath.tsx
import React from "react";
import { Group, Path, SkFont, Skia, Text } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

type Props = {
  x: number;
  y: number;
  barWidth: number;
  progress: SharedValue<number>;
  graphHeight: number;
  label: string;
  value: number;
  horizontal?: boolean;
  color?: string;
  font?: SkFont;
};

const BarPath = ({
  x,
  y,
  progress,
  barWidth,
  graphHeight,
  label,
  value,
  horizontal,
  color,
  font,
}: Props) => {
  const path = useDerivedValue(() => {
    const barPath = Skia.Path.Make();

    if (horizontal) {
      barPath.addRRect({
        rect: {
          x: 0,
          y: y - barWidth / 2,
          width: x * progress.value,
          height: barWidth,
        },
        rx: 8,
        ry: 8,
      });
    } else {
      barPath.addRRect({
        rect: {
          x: x - barWidth / 2,
          y: graphHeight,
          width: barWidth,
          height: -y * progress.value,
        },
        rx: 8,
        ry: 8,
      });
    }

    return barPath;
  });

  const textX = useDerivedValue(() =>
    horizontal ? x * progress.value + 5 : x - 15
  );

  const textY = useDerivedValue(() =>
    horizontal ? y + barWidth / 4 : graphHeight - y * progress.value - 5
  );

  return (
    <Group>
      <Path path={path} color={color} style="fill" />
      <Text
        text={label}
        x={textX}
        y={textY}
        color={"#FFFFFF"}
        font={font ?? null}
        opacity={progress}
      />
    </Group>
  );
};

export default BarPath;
