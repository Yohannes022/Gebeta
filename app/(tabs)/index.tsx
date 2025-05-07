import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryPill from "@/components/CategoryPill";
import RecipeCard from "@/components/RecipeCard";
import { popularTags } from "@/mocks/recipes";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;
  
  const { user } = useAuthStore();
  const { recipes, setSelectedTag } = useRecipeStore();
  const recipesLoading = false; // Replace with actual loading logic if needed
  const { restaurants, isLoading: restaurantsLoading } = useRestaurantStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const featuredRecipe = recipes[0];
  const popularRecipes = recipes.slice(1, 5);
  const featuredRestaurants = restaurants.slice(0, 3);
  
  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.tags.includes(selectedCategory))
    : popularRecipes;

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSeeAllPopular = () => {
    setSelectedTag(null);
    router.push("/search");
  };

  const handleSeeAllCategory = (category: string) => {
    setSelectedTag(category);
    router.push("/search");
  };

  const handleSeeAllRestaurants = () => {
    router.push("/restaurants");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const isLoading = recipesLoading || restaurantsLoading;

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#3E7EA6"} />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || "Guest"}</Text>
          <Text style={styles.subtitle}>What would you like to explore today?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Featured Recipe */}
      <View style={styles.featuredContainer}>
        <RecipeCard recipe={featuredRecipe} variant="featured" />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
            {popularTags.map((tag: string) => (
            <CategoryPill
              key={tag}
              title={tag}
              selected={selectedCategory === tag}
              onPress={() => handleCategoryPress(tag)}
            />
            ))}
        </ScrollView>
      </View>

      {/* Featured Restaurants */}
      <View style={styles.restaurantsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={handleSeeAllRestaurants}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={"#3E7EA6"} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.restaurantsScrollContent}
        >
          {featuredRestaurants.map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <Image
                source={{ uri: restaurant.imageUrl }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={"#D9A566"} fill={"#D9A566"} />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color={"#8A8A8A"} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {restaurant.address}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Recipes */}
      <View style={styles.popularContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Recipes` : "Popular Recipes"}
          </Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() =>
              selectedCategory
                ? handleSeeAllCategory(selectedCategory)
                : handleSeeAllPopular()
            }
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={"#3E7EA6"} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} variant="horizontal" />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F5F0",
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    color: "#8A8A8A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  featuredContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  restaurantsContainer: {
    marginBottom: 24,
  },
  restaurantsScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  restaurantCard: {
    width: 220,
    backgroundColor: "#F9F5F0",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: "100%",
    height: 120,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  restaurantMeta: {
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#8A8A8A",
    marginLeft: 4,
    flex: 1,
  },
  popularContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
  },
});
