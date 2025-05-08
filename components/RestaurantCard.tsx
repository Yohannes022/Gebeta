import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Clock, DollarSign, Star } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "horizontal" | "vertical" | "featured";
}

const { width } = Dimensions.get("window");

export default function RestaurantCard({
  restaurant,
  variant = "vertical",
}: RestaurantCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const renderPriceLevel = (level: number) => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <DollarSign
          key={index}
          size={14}
          color={index < level ? "#D9A566" : "#8A8A8A"}
          fill={index < level ? "#D9A566" : "none"}
        />
      ));
  };
  
  const cardStyles = [
    styles.card,
    variant === "horizontal" && styles.horizontalCard,
    variant === "featured" && styles.featuredCard,
  ];
  
  const imageStyles = [
    styles.image,
    variant === "horizontal" && styles.horizontalImage,
    variant === "featured" && styles.featuredImage,
  ];
  
  const contentStyles = [
    styles.content,
    variant === "horizontal" && styles.horizontalContent,
    variant === "featured" && styles.featuredContent,
  ];

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: variant === "featured" ? restaurant.coverImageUrl : restaurant.imageUrl }}
        style={imageStyles}
        contentFit="cover"
        transition={300}
      />
      
      {!restaurant.isOpen && (
        <View style={styles.closedBadge}>
          <Text style={styles.closedText}>Closed</Text>
        </View>
      )}
      
      <View style={contentStyles}>
        <View style={styles.header}>
          <Text
            style={[
              variant === "featured" ? {
                fontSize: 20,
                fontWeight: "600",
                color: "#000000",
                letterSpacing: 0.2,
              } : {
                fontSize: 18,
                fontWeight: "600",
                color: "#000000",
              },
              styles.title,
            ]}
            numberOfLines={2}
          >
            {restaurant.name}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={"#D9A566"} fill={"#D9A566"} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          </View>
        </View>
        
        <View style={styles.categories}>
          {restaurant.categories.map((category, index) => (
            <React.Fragment key={category}>
              <Text style={styles.category}>{category}</Text>
              {index < restaurant.categories.length - 1 && (
                <Text style={styles.categoryDot}>•</Text>
              )}
            </React.Fragment>
          ))}
        </View>
        
        {variant !== "horizontal" && (
          <Text style={styles.description} numberOfLines={2}>
            {restaurant.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={"#8A8A8A"} />
              <Text style={styles.metaText}>{restaurant.estimatedDeliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <View style={styles.priceLevelContainer}>
                {renderPriceLevel(restaurant.priceLevel)}
              </View>
            </View>
          </View>
          
          <View style={styles.deliveryFee}>
            <Text style={styles.deliveryFeeText}>
              {restaurant.deliveryFee === 0 
                ? "Free Delivery" 
                : `${restaurant.deliveryFee} Birr`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.9,
  },
  horizontalCard: {
    flexDirection: "row",
    height: 120,
    width: width * 0.9,
  },
  featuredCard: {
    height: 320,
    width: width * 0.9,
  },
  image: {
    height: 180,
    width: "100%",
  },
  horizontalImage: {
    height: "100%",
    width: 120,
  },
  featuredImage: {
    height: 200,
  },
  closedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  closedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  horizontalContent: {
    flex: 1,
  },
  featuredContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginLeft: 2,
    // color: "#8E8E8E",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    // color: "#8E8E8E",
  },
  categoryDot: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginHorizontal: 4,
    // color: "#8E8E8E",
  },
  description: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 12,
    // color: "#000000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  metaContainer: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginLeft: 4,
  },
  priceLevelContainer: {
    flexDirection: "row",
  },
  deliveryFee: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryFeeText: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    fontWeight: "500",
  },
});
