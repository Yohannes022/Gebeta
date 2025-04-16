import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Search, Filter, X, MapPin } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { categories } from "@/mocks/categories";
import { useExperiencesStore } from "@/store/experiences-store";
import ExperianceCard from "@/components/ExperianceCard";
import {FilterModal} from "@/components/FilterModal";
import CategoryPill from "@/components/CategoryPill";
import { Ionicons } from "@expo/vector-icons";
import { PriceRangeSlider } from "@/components/PriceRangeSlider";
import { DurationFilter } from "@/components/DurationFilter";
import { GuestsFilter } from "@/components/GuestsFilter";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { category: categoryParam } = params;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam ? String(categoryParam) : null
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState([
    "Injera", "Coffee ceremony", "Doro Wat", "Vegetarian"
  ]);
  const [popularSearches, setPopularSearches] = useState([
    "Traditional breakfast", "Cooking class", "Coffee tasting", "Vegan options"
  ]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    experiences, 
    setSearchQuery: storeSetSearchQuery,
    setSelectedCategory: storeSetSelectedCategory,
    setFilters,
    getFilteredExperiences,
  } = useExperiencesStore();

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(String(categoryParam));
      storeSetSelectedCategory(String(categoryParam));
    }
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    storeSetSearchQuery(searchQuery);
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
    
    // Simulate search delay
    setTimeout(() => {
      // Filter experiences based on search query
      const results = experiences.filter(exp => 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      storeSetSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      storeSetSelectedCategory(categoryId);
    }
  };

  const handleExperiencePress = (id: string) => {
    router.push(`/experience/${id}`);
  };

  const handleFilterApply = (filters: any) => {
    setIsFilterVisible(false);
    setIsLoading(true);
    setFilters(filters);
    
    // Simulate filter delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    storeSetSearchQuery("");
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    storeSetSearchQuery(search);
    handleSearch();
  };

  const categories = ["All", "Food", "Culture", "Adventure", "Nature"];
  const selectedCategoryObj = categories.find(c => c === selectedCategory);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Safely get filtered experiences
  const filteredExperiences = getFilteredExperiences() || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.lightText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Ethiopian experiences..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(category === "All" ? null : category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <PriceRangeSlider onValueChange={handleFilterChange} />
          <DurationFilter onValueChange={handleFilterChange} />
          <GuestsFilter onValueChange={handleFilterChange} />
        </View>
      )}

      {filteredExperiences.length > 0 ? (
        <FlatList
          data={filteredExperiences}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          renderItem={({ item }) => (
            item ? (
              <ExperianceCard 
                experience={item} 
                onPress={() => handleExperiencePress(item.id)}
              />
            ) : null
          )}
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        <ScrollView style={styles.scrollContent}>
          {/* Recent Searches */}
          <View style={styles.searchSection}>
            <Text style={styles.searchSectionTitle}>Recent Searches</Text>
            <View style={styles.searchTermsContainer}>
              {recentSearches.map((term, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.searchTerm}
                  onPress={() => handleRecentSearchPress(term)}
                >
                  <Text style={styles.searchTermText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Searches */}
          <View style={styles.searchSection}>
            <Text style={styles.searchSectionTitle}>Popular Searches</Text>
            <View style={styles.searchTermsContainer}>
              {popularSearches.map((term, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.searchTerm}
                  onPress={() => handleRecentSearchPress(term)}
                >
                  <Text style={styles.searchTermText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Locations */}
          <View style={styles.searchSection}>
            <Text style={styles.searchSectionTitle}>Popular Locations</Text>
            <View style={styles.locationsContainer}>
              <TouchableOpacity style={styles.locationCard}>
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }} 
                  style={styles.locationImage}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>Addis Ababa</Text>
                  <View style={styles.locationDetail}>
                    <MapPin size={14} color={Colors.lightText} />
                    <Text style={styles.locationCount}>24 experiences</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.locationCard}>
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }} 
                  style={styles.locationImage}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>Lalibela</Text>
                  <View style={styles.locationDetail}>
                    <MapPin size={14} color={Colors.lightText} />
                    <Text style={styles.locationCount}>12 experiences</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleFilterApply}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Layout.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    marginLeft: Layout.spacing.m,
    padding: Layout.spacing.s,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    flex: 1,
  },
  searchSection: {
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
  searchTermsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  searchTerm: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    marginRight: Layout.spacing.s,
    marginBottom: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchTermText: {
    fontSize: 14,
    color: Colors.text,
  },
  locationsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationCard: {
    width: "48%",
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
    backgroundColor: Colors.card,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationImage: {
    width: "100%",
    height: 100,
  },
  locationInfo: {
    padding: Layout.spacing.m,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  locationDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationCount: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  resultsContainer: {
    padding: Layout.spacing.l,
  },
  categoriesContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});