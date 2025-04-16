import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image,
  View
} from "react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { Category } from "@/types";

interface CategoryItemProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryItem({ category, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: category.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: Layout.spacing.m,
    width: 80,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 35,
    overflow: "hidden",
    marginBottom: Layout.spacing.xs,
    backgroundColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
  },
});