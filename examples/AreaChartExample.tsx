"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { CartesianChart, AreaChart, Scatter } from "exchartz";

const { width } = Dimensions.get("window");

export default function AreaChartExample() {
  const [areaData, setAreaData] = useState([
    { x: 0, y: 10 },
    { x: 1, y: 25 },
    { x: 2, y: 15 },
    { x: 3, y: 30 },
    { x: 4, y: 20 },
    { x: 5, y: 35 },
    { x: 6, y: 25 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAreaData((prevData) =>
        prevData.map((item) => ({
          ...item,
          y: Math.floor(Math.random() * 200),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Area Chart Example</Text>
      <CartesianChart
        width={width - 40}
        height={200}
        padding={{ left: 60, bottom: 40, right: 20, top: 20 }}
        backgroundColor="#001429"
        xAxis={{
          label: "Time",
          domain: [0, 6],
          tickCount: 7,
        }}
        yAxis={{
          label: "Value",
          domain: [0, Math.max(...areaData.map((d) => d.y)) * 1.2],
          tickCount: 5,
        }}
      >
        <Scatter
          data={areaData}
          dotRadius={5}
          dotColor="#FF5733"
          animated={true}
        />
        <AreaChart
          data={areaData}
          areaColor="#2196F3"
          lineColor="#0D47A1"
          opacity={0.3}
          animated={true}
        />
      </CartesianChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});
