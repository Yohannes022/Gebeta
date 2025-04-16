import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import Slider from "@react-native-community/slider";

interface PriceRangeSliderProps {
  onValueChange: (filters: any) => void;
}

export function PriceRangeSlider({ onValueChange }: PriceRangeSliderProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
    onValueChange({ minPrice: value, maxPrice });
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
    onValueChange({ minPrice, maxPrice: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Range</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.priceText}>${minPrice}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1000}
          step={10}
          value={minPrice}
          onValueChange={handleMinPriceChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007AFF"
        />
        <Text style={styles.priceText}>${maxPrice}</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.priceText}>${minPrice}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1000}
          step={10}
          value={maxPrice}
          onValueChange={handleMaxPriceChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007AFF"
        />
        <Text style={styles.priceText}>${maxPrice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  priceText: {
    width: 60,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
});