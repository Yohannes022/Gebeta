import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ChevronDown, Filter, MapPin, SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CategoryPill from "@/components/CategoryPill";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { restaurantCategories } from "@/mocks/restaurants";
import { useRestaurantStore } from "@/store/restaurantStore";

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Nearest", value: "distance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function RestaurantsScreen() {
  const router = useRouter();
  const {
    restaurants,
    filteredRestaurants,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    sortRestaurants,
    filterByPriceLevel,
    filterByDeliveryTime,
    isLoading,
    fetchRestaurants,
    error
  } = useRestaurantStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("popular");
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<number | null>(null);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;

  useEffect(() => {
    // Fetch restaurants when component mounts
    fetchRestaurants();
    
    // Request location permission
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
      
      if (status === "granted") {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (err) {
          console.log("Error getting location:", err);
        }
      }
    })();
  }, []);

  useEffect(() => {
    // Apply sorting when selected option changes
    if (userLocation || selectedSort !== "distance") {
      sortRestaurants(selectedSort, userLocation);
    }
  }, [selectedSort, userLocation, sortRestaurants]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handlePriceLevelSelect = (level: number) => {
    const newLevel = selectedPriceLevel === level ? null : level;
    setSelectedPriceLevel(newLevel);
    filterByPriceLevel(newLevel);
  };

  const handleDeliveryTimeSelect = (time: number | null) => {
    setMaxDeliveryTime(time);
    filterByDeliveryTime(time);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showSortOptions) setShowSortOptions(false);
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
    if (showFilters) setShowFilters(false);
  };

  const handleSortSelect = (sortValue: string) => {
    setSelectedSort(sortValue);
    setShowSortOptions(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceLevel(null);
    setMaxDeliveryTime(null);
    setSearchQuery("");
    filterByPriceLevel(null);
    filterByDeliveryTime(null);
  };

  const getSelectedSortLabel = () => {
    return sortOptions.find(option => option.value === selectedSort)?.label || "Sort";
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
      
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert(
          "Location Permission",
          "We need your location to show nearby restaurants. Please enable location services in your settings.",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      console.log("Error requesting location permission:", err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#3E7EA6"} />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchRestaurants}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search restaurants, cuisines..."
        />
        <View style={styles.filterSortContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (selectedCategory || selectedPriceLevel || maxDeliveryTime ? styles.activeFilterButton : null),
            ]}
            onPress={toggleFilters}
          >
            <Filter
              size={20}
              color={
                selectedCategory || selectedPriceLevel || maxDeliveryTime
                  ? "#FFFFFF"
                  : "#2D2D2D"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={toggleSortOptions}
          >
            <SlidersHorizontal size={20} color={"#2D2D2D"} />
            {!isTablet && <Text style={styles.sortButtonText}>{getSelectedSortLabel()}</Text>}
            <ChevronDown size={16} color={"#2D2D2D"} />
          </TouchableOpacity>
        </View>
      </View>

      {!locationPermission && selectedSort === "distance" && (
        <TouchableOpacity 
          style={styles.locationPermissionButton}
          onPress={requestLocationPermission}
        >
          <MapPin size={16} color={"#3E7EA6"} />
          <Text style={styles.locationPermissionText}>Enable location for better results</Text>
        </TouchableOpacity>
      )}

      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                selectedSort === option.value && styles.selectedSortOption,
              ]}
              onPress={() => handleSortSelect(option.value)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  selectedSort === option.value && styles.selectedSortOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Categories</Text>
              {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {restaurantCategories.map((category) => (
                <CategoryPill
                  key={category}
                  title={category}
                  selected={selectedCategory === category}
                  onPress={() => handleCategorySelect(category)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Price Level</Text>
              {selectedPriceLevel && (
                <TouchableOpacity onPress={() => handlePriceLevelSelect(selectedPriceLevel)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.priceLevelContainer}>
              {[1, 2, 3].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priceLevelButton,
                    selectedPriceLevel === level && styles.selectedPriceLevelButton,
                  ]}
                  onPress={() => handlePriceLevelSelect(level)}
                >
                  <Text
                    style={[
                      styles.priceLevelButtonText,
                      selectedPriceLevel === level && styles.selectedPriceLevelButtonText,
                    ]}
                  >
                    {"$".repeat(level)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Delivery Time</Text>
              {maxDeliveryTime && (
                <TouchableOpacity onPress={() => handleDeliveryTimeSelect(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.deliveryTimeContainer}>
              {[15, 30, 45, 60].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.deliveryTimeButton,
                    maxDeliveryTime === time && styles.selectedDeliveryTimeButton,
                  ]}
                  onPress={() => handleDeliveryTimeSelect(time)}
                >
                  <Text
                    style={[
                      styles.deliveryTimeButtonText,
                      maxDeliveryTime === time && styles.selectedDeliveryTimeButtonText,
                    ]}
                  >
                    {`${time} min`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearAllText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredRestaurants.length > 0 ? (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => 
            index === 0 ? (
              <RestaurantCard restaurant={item} variant="featured" />
            ) : (
              <RestaurantCard restaurant={item} />
            )
          }
          contentContainerStyle={styles.restaurantsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Restaurants` : "All Restaurants"}
            </Text>
          }
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? "tablet-view" : "phone-view"}
          columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : undefined}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No restaurants found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters to find what you're looking for
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.retryButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    color: "#8E8E8E",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterSortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  activeFilterButton: {
    backgroundColor: "#FFFFFF",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    marginLeft: 8,
  },
  sortButtonText: {
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 8,
  },
  locationPermissionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF" + "15",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationPermissionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    marginLeft: 8,
  },
  sortOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
  },
  selectedSortOption: {
    backgroundColor: "#FFFFFF" + "10",
  },
  sortOptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  selectedSortOptionText: {
    color: "#3E7EA6",
    fontWeight: "600",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  priceLevelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceLevelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  selectedPriceLevelButton: {
    backgroundColor: "#FFFFFF",
  },
  priceLevelButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  selectedPriceLevelButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryTimeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  selectedDeliveryTimeButton: {
    backgroundColor: "#FFFFFF",
  },
  deliveryTimeButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  selectedDeliveryTimeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  clearAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
  },
  clearAllText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  restaurantsList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
});
