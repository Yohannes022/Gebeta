import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { Category } from "@/types";

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryPill({ 
  category, 
  isSelected, 
  onPress 
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text,
          isSelected && styles.selectedText
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderRadius: 20,
    marginRight: Layout.spacing.s,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 16, // Increased from 14
    color: Colors.text,
    fontWeight: "500",
  },
  selectedText: {
    color: Colors.background,
    fontWeight: "600",
  },
});