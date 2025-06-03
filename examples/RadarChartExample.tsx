"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { RadarChart } from "exchartz";

const { width } = Dimensions.get("window");

export default function RadarChartExample() {
  const [radarData, setRadarData] = useState([
    { key: "strength", value: 80, label: "Strength" },
    { key: "speed", value: 70, label: "Speed" },
    { key: "power", value: 90, label: "Power" },
    { key: "technique", value: 85, label: "Technique" },
    { key: "stamina", value: 65, label: "Stamina" },
    { key: "agility", value: 75, label: "Agility" },
    { key: "fist", value: 90, label: "Fist" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.floor(Math.random() * 100),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const radarDatasets = [
    {
      data: radarData,
      fillColor: "rgba(33, 150, 243, 0.2)",
      strokeColor: "#2196F3",
      strokeWidth: 2,
      opacity: 0.7,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radar Chart Example</Text>
      <View style={styles.radarContainer}>
        <RadarChart
          datasets={radarDatasets}
          width={width - 40}
          height={250}
          maxValue={100}
          showLabels={true}
          labelColor="#FFFFFF"
          showAxes={true}
          axisColor="#555555"
          showGrid={true}
          gridCount={4}
          gridColor="#333333"
          animated={true}
          animationDuration={500}
        />
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
  radarContainer: {
    backgroundColor: "#001429",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
