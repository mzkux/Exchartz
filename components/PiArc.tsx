import { Group, Path, Skia, Text } from "@shopify/react-native-skia";
import {} from "d3-shape";
import { useDerivedValue } from "react-native-reanimated";
import { PieArcProps } from "../types";

export default function PiArc(props: PieArcProps) {
  const { slice, i, data, radius, font, fontColor, progress } = props;

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();

    const currentEndAngle =
      slice.startAngle + (slice.endAngle - slice.startAngle) * progress.value;

    if (currentEndAngle <= slice.startAngle) {
      return path;
    }

    path.moveTo(0, 0);

    const startX = Math.cos(slice.startAngle) * radius;
    const startY = Math.sin(slice.startAngle) * radius;
    path.lineTo(startX, startY);

    const rect = Skia.XYWHRect(-radius, -radius, radius * 2, radius * 2);
    const startDegrees = slice.startAngle * (180 / Math.PI);
    const sweepDegrees = (currentEndAngle - slice.startAngle) * (180 / Math.PI);

    path.arcToOval(rect, startDegrees, sweepDegrees, false);

    path.close();

    return path;
  });

  const midAngle = slice.startAngle + (slice.endAngle - slice.startAngle) / 2;

  const labelRadius = radius * 0.67;

  const centroid = {
    x: Math.cos(midAngle) * labelRadius,
    y: Math.sin(midAngle) * labelRadius,
  };

  const textValue = data[i].value.toString();
  const textWidth = font?.measureText(textValue).width || 0;

  return (
    <Group>
      <Path path={path} color={data[i].color || "gray"} />

      <Path path={path} color="white" style="stroke" strokeWidth={1} />

      <Text
        x={centroid.x - textWidth / 2}
        y={centroid.y + font?.getSize() / 3}
        text={textValue}
        font={font}
        color={fontColor ? fontColor : "white"}
      />
    </Group>
  );
}
