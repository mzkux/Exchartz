"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { CartesianChart, BarChart } from "exchartz";

const { width } = Dimensions.get("window");

export default function BarChartExample() {
  const [barData, setBarData] = useState([
    { x: "A", y: 10 },
    { x: "B", y: 25 },
    { x: "C", y: 15 },
    { x: "D", y: 30 },
    { x: "E", y: 20 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarData((prevData) => {
        const newLength = Math.floor(Math.random() * 5) + 3; // Random length between 3 and 7
        return Array.from({ length: newLength }, (_, index) => ({
          x: String.fromCharCode(65 + index), // Generate labels A, B, C, etc.
          y: Math.floor(Math.random() * 200),
        }));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bar Chart Example</Text>
      <CartesianChart
        width={width - 40}
        height={250}
        padding={{ left: 60, bottom: 60, right: 20, top: 40 }}
        backgroundColor="#001429"
        xAxis={{
          label: "Category",
          domain: [0, 300],
          showLabels: true,
          showTicks: true,
        }}
        yAxis={{
          label: "Value",
          domain: barData.map((d) => d.x),
          scaleType: "band",
          tickCount: 6,
          showTicks: true,
          showLabels: true,
        }}
      >
        <BarChart
          barWidth={15}
          data={barData}
          barColor={["#FF5733", "#33FF57", "#3357FF"]}
          cornerRadius={4}
          animated={true}
          horizontal
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
