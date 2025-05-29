import { SkFont } from "@shopify/react-native-skia";
import { PieArcDatum } from "d3";
import { SharedValue } from "react-native-reanimated";

export interface DataPoint {
  x: number | string | Date;
  y: number;
  color?: string;
  label?: string;
  dotRadius?: number;
  dotColor?: string;
}

export type ScaleType = "linear" | "time" | "band" | "log";

export interface AxisConfig {
  showAxis?: boolean;
  showGrid?: boolean;
  showTicks?: boolean;
  showLabels?: boolean;
  axisColor?: string;
  gridColor?: string;
  labelColor?: string;
  tickLength?: number;
  tickCount?: number;
  tickValues?: Array<any>;
  label?: string;
  domain?: Array<any>;
  scaleType?: ScaleType;
}

export interface CartesianChartProps {
  width: number;
  height: number;
  padding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  backgroundColor?: string;
  children: React.ReactNode;
}

export interface AreaChartProps {
  data: DataPoint[];
  areaColor?: string;
  lineColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  dotColor?: string;
  curve?: d3.CurveFactory;
  opacity?: number;
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
}

export interface LineChartProps {
  data: DataPoint[];
  lineColor?: string;
  strokeWidth?: number;
  curve?: d3.CurveFactory;
  showDots?: boolean;
  dotRadius?: number;
  dotColor?: string;
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
}

export interface ScatterChartProps {
  data: DataPoint[];
  dotColor?: string;
  dotRadius?: number;
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  font?: SkFont;
}

export interface BarChartProps {
  data: DataPoint[];
  barColor?: string[];
  barWidth?: number;
  cornerRadius?: number;
  spacing?: number;
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  staggered?: boolean;
  horizontal?: boolean;
  labelPadding?: number;
  font?: SkFont;
}

export interface RadarDataPoint {
  key: string;
  value: number;
  label?: string;
}

export interface RadarDataSet {
  data: RadarDataPoint[];
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface RadarChartProps {
  datasets: RadarDataSet[];
  width: number;
  height: number;
  maxValue?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelSize?: number;
  showAxes?: boolean;
  axisColor?: string;
  axisWidth?: number;
  showGrid?: boolean;
  gridCount?: number;
  gridColor?: string;
  gridWidth?: number;
  animated?: boolean;
  animationDuration?: number;
  showValues?: boolean;
  valueColor?: string;
  valueSize?: number;
  labelPadding?: number;
  labelFont?: SkFont;
  valueFont?: SkFont;
}

export interface pieData {
  value: number;
  color: string;
  label: string;
}

export interface PieChartProps {
  data: pieData[];
  size?: number;
  animated?: boolean;
  font?: SkFont;
  fontColor?: string;
}

export interface PieArcProps {
  slice: PieArcDatum<{ value: number }>;
  i: number;
  data: { value: number; color: string; label: string }[];
  radius: number;
  font: SkFont;
  progress: SharedValue<number>;
  fontColor?: string;
}
