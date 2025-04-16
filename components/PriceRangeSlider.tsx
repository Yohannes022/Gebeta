import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";

// This is a simplified slider component for demo purposes
// In a real app, you would use a proper slider component like @react-native-community/slider
interface PriceRangeSliderProps {
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
  min: number;
  max: number;
}

export default function PriceRangeSlider({
  range,
  onRangeChange,
  min,
  max,
}: PriceRangeSliderProps) {
  // This is just a placeholder component
  // In a real app, you would implement a proper slider
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View></View>
        <View></View>
        <View></View>
        {/*
         <View
          style={[
            styles.selectedTrack,
            {
              left: ${((range[0] - min) / (max - min)) * 100}%,
              right: ${100 - ((range[1] - min) / (max - min)) * 100}%,
            },
          ]}></View>

          
      <View
        style={[
          styles.thumb,
          {
            left: ${((range[0] - min) / (max - min)) * 100}%,
          },
        ]}
      ></View>
      <View
        style={[
          styles.thumb,
          {
            left: ${((range[1] - min) / (max - min)) * 100}%,
          },
        ]}
      > */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  selectedTrack: {
    position: "absolute",
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginLeft: -10,
    top: 10,
  },
});