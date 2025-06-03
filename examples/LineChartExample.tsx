"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { CartesianChart, LineChart, Scatter } from "exchartz";
const { width } = Dimensions.get("window");

export default function LineChartExample() {
  const [lineData, setLineData] = useState([
    { x: "A", y: 10 },
    { x: "B", y: 25 },
    { x: "C", y: 15 },
    { x: "D", y: 30 },
    { x: "E", y: 20 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineData((prevData) =>
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
      <Text style={styles.title}>Line Chart Example</Text>
      <CartesianChart
        width={width - 40}
        height={200}
        padding={{ left: 60, bottom: 40, right: 20, top: 40 }}
        backgroundColor="#001429"
        xAxis={{
          label: "Category",
          domain: ["A", "B", "C", "D", "E"],
          scaleType: "band",
        }}
        yAxis={{
          label: "Value",
          domain: [0, 200],
          tickCount: 5,
          showTicks: true,
        }}
      >
        <LineChart
          data={lineData}
          lineColor="#4CAF50"
          showDots={true}
          dotRadius={5}
          animated={true}
        />
        <LineChart
          data={lineData}
          lineColor="#FF5733"
          showDots={true}
          dotRadius={5}
          animated={true}
        />
        <Scatter
          data={lineData}
          dotRadius={5}
          dotColor="#FF5733"
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
