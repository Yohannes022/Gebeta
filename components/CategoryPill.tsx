import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
 


interface CategoryPillProps {
  title: string;
  selected?: boolean;
  onPress: () => void;
}

export default function CategoryPill({
  title,
  selected = false,
  onPress,
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selectedPill]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.pillText, selected && styles.selectedPillText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPill: {
    backgroundColor: "#000000",
  },
  pillText: {
    fontSize: 12.5,
    color: "#8E8E8E",
    lineHeight: 16,
    fontWeight: "500",
    textTransform: "capitalize",
    // color: "#000000",
  },
  selectedPillText: {
    color: "#FFFFFF",
  },
});
