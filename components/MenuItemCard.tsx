import { Image } from "expo-image";
import { Flame, Leaf, Plus } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { MenuItem } from "@/types/restaurant";

interface MenuItemCardProps {
  item: MenuItem;
  onPress: () => void;
  onAddToCart?: () => void;
  variant?: "horizontal" | "vertical";
}

const { width } = Dimensions.get("window");

export default function MenuItemCard({
  item,
  onPress,
  onAddToCart,
  variant = "horizontal",
}: MenuItemCardProps) {
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const cardStyles = [
    styles.card,
    variant === "vertical" && styles.verticalCard,
  ];
  
  const imageStyles = [
    styles.image,
    variant === "vertical" && styles.verticalImage,
  ];
  
  const contentStyles = [
    styles.content,
    variant === "vertical" && styles.verticalContent,
  ];

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={imageStyles}
        contentFit="cover"
        transition={300}
      />
      
      <View style={contentStyles}>
        <View style={styles.header}>
          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          
          <View style={styles.badgesContainer}>
            {item.isSpicy && (
              <View style={styles.badge}>
                <Flame size={12} color={"#3E7EA6"} />
              </View>
            )}
            {item.isVegetarian && (
              <View style={styles.badge}>
                <Leaf size={12} color={"#6A8E7F"} />
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{item.price} Birr</Text>
          
          {onAddToCart && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <Plus size={18} color={"#FFFFFF"} />
            </TouchableOpacity>
          )}
        </View>
        
        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    width: width * 0.9,
  },
  verticalCard: {
    flexDirection: "column",
    width: width * 0.45,
  },
  image: {
    height: 100,
    width: 100,
  },
  verticalImage: {
    height: 140,
    width: "100%",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  verticalContent: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
    // fontSize: 16,
  },
  badgesContainer: {
    flexDirection: "row",
  },
  badge: {
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    marginBottom: 8,
    // color: "#8A8A8A",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#F9F5F0",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#D9A566",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    fontWeight: "600",
    // color: "#000000",
    // fontSize: 10,
  },
});
