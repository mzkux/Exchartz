"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { PieChart } from "exchartz";

const { width } = Dimensions.get("window");

export default function PieChartExample() {
  const [pieData, setPieData] = useState([
    { value: 30, color: "#FF5733", label: "Category A" },
    { value: 25, color: "#33FF57", label: "Category B" },
    { value: 15, color: "#3357FF", label: "Category C" },
    { value: 20, color: "#F3FF33", label: "Category D" },
    { value: 10, color: "#FF33F3", label: "Category E" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPieData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.floor(Math.random() * 50) + 10, // Random value between 10-60
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pie Chart Example</Text>
      <View style={styles.pieContainer}>
        <PieChart data={pieData} animated={true} />
      </View>
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
  pieContainer: {
    backgroundColor: "#001429",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
