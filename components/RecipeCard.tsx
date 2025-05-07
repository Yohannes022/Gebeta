import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bookmark, Clock, Heart, Users } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { useRecipeStore } from "@/store/recipeStore";
import { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  variant?: "horizontal" | "vertical" | "featured";
}

const { width } = Dimensions.get("window");

export default function RecipeCard({
  recipe,
  variant = "vertical",
}: RecipeCardProps) {
  const router = useRouter();
  const { toggleLike, toggleSave } = useRecipeStore();

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    toggleLike(recipe.id);
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    toggleSave(recipe.id);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  
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
        source={{ uri: recipe.imageUrl }}
        style={imageStyles}
        contentFit="cover"
        transition={300}
      />
      
      {variant === "featured" && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      <View style={contentStyles}>
        <View style={styles.header}>
          <Text
            style={[
              variant === "featured" ? {
                fontSize: 20,
                fontWeight: "600",
                color: "#2D2D2D",
                letterSpacing: 0.2,
              } : {
                fontSize: 18,
                fontWeight: "600",
                color: "#2D2D2D",
              },
              styles.title,
            ]}
            numberOfLines={2}
          >
            {recipe.title}
          </Text>
          
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: recipe.authorAvatar }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>{recipe.authorName}</Text>
          </View>
        </View>
        
        {variant !== "horizontal" && (
          <Text style={styles.description} numberOfLines={2}>
            {recipe.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={"#8A8A8A"} />
              <Text style={styles.metaText}>{totalTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={14} color={"#8A8A8A"} />
              <Text style={styles.metaText}>{recipe.servings}</Text>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Heart
                size={18}
                color={recipe.isLiked ? "#3E7EA6" : "#8A8A8A"}
                fill={recipe.isLiked ? "#3E7EA6" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSave}
            >
              <Bookmark
                size={18}
                color={recipe.isSaved ? "#D9A566" : "#8A8A8A"}
                fill={recipe.isSaved ? "#D9A566" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>
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
    width: width * 0.9,
  },
  horizontalCard: {
    flexDirection: "row",
    height: 120,
    width: width * 0.9,
  },
  featuredCard: {
    height: 400,
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
    height: 250,
  },
  featuredBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#F9F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredText: {
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
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#8A8A8A",
  },
  description: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginBottom: 12,
    // color: "#2D2D2D",
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
    color: "#8A8A8A",
    lineHeight: 16,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 16,
  },
});
