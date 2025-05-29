import React, { useMemo, createContext, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Canvas, Line, Group } from "@shopify/react-native-skia";
import { CartesianChartProps, AxisConfig } from "../types";
import { createScale, generateTicks } from "../utils/scales";

interface ChartContextType {
  innerWidth: number;
  innerHeight: number;
  xScale: any;
  yScale: any;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

const ChartContext = createContext<ChartContextType | null>(null);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("Chart components must be used within a CartesianChart");
  }
  return context;
};

const DEFAULT_PADDING = { left: 40, right: 20, top: 20, bottom: 40 };
const DEFAULT_AXIS_CONFIG: AxisConfig = {
  showAxis: true,
  showGrid: true,
  showTicks: true,
  showLabels: true,
  axisColor: "white",
  gridColor: "rgba(255, 255, 255, 0.2)",
  labelColor: "white",
  tickLength: 5,
  tickCount: 5,
  scaleType: "linear",
};

const CartesianChart: React.FC<CartesianChartProps> = ({
  width,
  height,
  padding = DEFAULT_PADDING,
  xAxis = DEFAULT_AXIS_CONFIG,
  yAxis = DEFAULT_AXIS_CONFIG,
  backgroundColor = "#000000",
  children,
}) => {
  const chartPadding = {
    left: padding.left ?? DEFAULT_PADDING.left,
    right: padding.right ?? DEFAULT_PADDING.right,
    top: padding.top ?? DEFAULT_PADDING.top,
    bottom: padding.bottom ?? DEFAULT_PADDING.bottom,
  };

  const innerWidth = width - chartPadding.left - chartPadding.right;
  const innerHeight = height - chartPadding.top - chartPadding.bottom;

  const defaultXDomain = xAxis.scaleType === "band" ? [] : [0, 100];
  const defaultYDomain = yAxis.scaleType === "band" ? [] : [0, 100];

  const xScale = useMemo(
    () =>
      createScale(xAxis.scaleType || "linear", xAxis.domain || defaultXDomain, [
        20,
        innerWidth - 20,
      ]),
    [xAxis.domain, xAxis.scaleType, innerWidth]
  );

  const yScale = useMemo(
    () =>
      createScale(yAxis.scaleType || "linear", yAxis.domain || defaultYDomain, [
        innerHeight,
        10,
      ]),
    [yAxis.domain, yAxis.scaleType, innerHeight]
  );

  const xTicks = xAxis.tickValues || generateTicks(xScale, xAxis.tickCount);
  const yTicks = yAxis.tickValues || generateTicks(yScale, yAxis.tickCount);

  const contextValue = useMemo(
    () => ({
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      padding: chartPadding,
    }),
    [innerWidth, innerHeight, xScale, yScale, chartPadding]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width, height, backgroundColor }]}>
        <Canvas style={{ width, height }}>
          {yAxis.showGrid && (
            <Group>
              {yTicks.map((tick: any, index: number) => {
                const y = yScale(tick)! + chartPadding.top;
                return (
                  <Line
                    key={`y-grid-${index}`}
                    p1={{ x: chartPadding.left, y }}
                    p2={{ x: width - chartPadding.right, y }}
                    color={yAxis.gridColor || DEFAULT_AXIS_CONFIG.gridColor!}
                    strokeWidth={1}
                  />
                );
              })}
            </Group>
          )}

          {xAxis.showGrid && (
            <Group>
              {xTicks.map((tick: any, index: number) => {
                const x = xScale(tick)! + chartPadding.left;
                return (
                  <Line
                    key={`x-grid-${index}`}
                    p1={{ x, y: chartPadding.top }}
                    p2={{ x, y: height - chartPadding.bottom }}
                    color={xAxis.gridColor || DEFAULT_AXIS_CONFIG.gridColor!}
                    strokeWidth={1}
                  />
                );
              })}
            </Group>
          )}

          {yAxis.showAxis && (
            <Line
              p1={{ x: chartPadding.left, y: height - chartPadding.bottom }}
              p2={{ x: chartPadding.left, y: chartPadding.top }}
              color={yAxis.axisColor || DEFAULT_AXIS_CONFIG.axisColor!}
              strokeWidth={2}
            />
          )}

          {xAxis.showAxis && (
            <Line
              p1={{ x: chartPadding.left, y: height - chartPadding.bottom }}
              p2={{
                x: width - chartPadding.right,
                y: height - chartPadding.bottom,
              }}
              color={xAxis.axisColor || DEFAULT_AXIS_CONFIG.axisColor!}
              strokeWidth={2}
            />
          )}

          {xAxis.showTicks &&
            xTicks.map((tick: any, index: number) => {
              const x = xScale(tick)! + chartPadding.left;
              return (
                <Line
                  key={`x-tick-${index}`}
                  p1={{ x, y: height - chartPadding.bottom }}
                  p2={{
                    x,
                    y: height - chartPadding.bottom + (xAxis.tickLength || 5),
                  }}
                  color={xAxis.axisColor || DEFAULT_AXIS_CONFIG.axisColor!}
                  strokeWidth={2}
                />
              );
            })}

          {yAxis.showTicks &&
            yTicks.map((tick: any, index: number) => {
              const y = yScale(tick)! + chartPadding.top;
              return (
                <Line
                  key={`y-tick-${index}`}
                  p1={{ x: chartPadding.left, y }}
                  p2={{ x: chartPadding.left - (yAxis.tickLength || 5), y }}
                  color={yAxis.axisColor || DEFAULT_AXIS_CONFIG.axisColor!}
                  strokeWidth={2}
                />
              );
            })}
        </Canvas>

        {xAxis.showLabels && (
          <View style={styles.xTicksContainer}>
            {xTicks.map((tick: any, index: number) => {
              const x = xScale(tick)! + chartPadding.left;
              return (
                <Text
                  key={`x-label-${index}`}
                  style={[
                    styles.tickLabel,
                    {
                      position: "absolute",
                      left: x,
                      top: height - chartPadding.bottom + 10,
                      width: 40,
                      color: xAxis.labelColor || DEFAULT_AXIS_CONFIG.labelColor,
                    },
                  ]}
                >
                  {tick.toString()}
                </Text>
              );
            })}
          </View>
        )}

        {yAxis.showLabels && (
          <View style={styles.yTicksContainer}>
            {yTicks.map((tick: any, index: number) => {
              const y = yScale(tick)! + chartPadding.top;
              return (
                <Text
                  key={`y-label-${index}`}
                  style={[
                    styles.tickLabel,
                    {
                      position: "absolute",
                      right: width - chartPadding.left + 5,
                      top: y,
                      width: 35,
                      textAlign: "right",
                      marginRight: 4,
                      color: yAxis.labelColor || DEFAULT_AXIS_CONFIG.labelColor,
                    },
                  ]}
                >
                  {tick.toString()}
                </Text>
              );
            })}
          </View>
        )}

        {xAxis.label && (
          <Text
            style={[
              styles.axisLabel,
              {
                position: "absolute",
                bottom: 10,
                left: 0,
                right: 0,
                textAlign: "center",
                color: xAxis.labelColor || DEFAULT_AXIS_CONFIG.labelColor,
              },
            ]}
          >
            {xAxis.label}
          </Text>
        )}

        {yAxis.label && (
          <Text
            style={[
              styles.axisLabel,
              {
                position: "absolute",
                left: 0,
                top: height / 2,
                textAlign: "center",
                transform: [{ rotate: "-90deg" }],
                color: yAxis.labelColor || DEFAULT_AXIS_CONFIG.labelColor,
              },
            ]}
          >
            {yAxis.label}
          </Text>
        )}

        <View
          style={[
            styles.chartContentContainer,
            {
              top: chartPadding.top,
              left: chartPadding.left,
              width: innerWidth,
              height: innerHeight,
            },
          ]}
        >
          <ChartContext.Provider value={contextValue}>
            {children}
          </ChartContext.Provider>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    position: "relative",
    borderRadius: 20,
  },
  chartContentContainer: {
    position: "absolute",
  },
  xTicksContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  yTicksContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  tickLabel: {
    fontSize: 10,
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CartesianChart;
