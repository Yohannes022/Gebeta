import { useRouter } from "expo-router";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CategoryPill from "@/components/CategoryPill";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import { difficulties, popularTags, regions } from "@/mocks/recipes";
import { useRecipeStore } from "@/store/recipeStore";

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Cooking Time", value: "time" },
];

export default function SearchScreen() {
  const router = useRouter();
  const {
    recipes,
    filteredRecipes,
    selectedTag,
    selectedRegion,
    searchQuery,
    setSelectedTag,
    setSelectedRegion,
    setSearchQuery,
    sortRecipes,
    filterByDifficulty,
    filterByTime,
  } = useRecipeStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("popular");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;

  useEffect(() => {
    // Apply sorting when selected option changes
    sortRecipes(selectedSort);
  }, [selectedSort, sortRecipes]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };

  const handleDifficultySelect = (difficulty: string) => {
    const newDifficulty = selectedDifficulty === difficulty ? null : difficulty;
    setSelectedDifficulty(newDifficulty);
    filterByDifficulty(newDifficulty);
  };

  const handleTimeSelect = (time: number | null) => {
    setMaxTime(time);
    filterByTime(time);
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
    setSelectedTag(null);
    setSelectedRegion(null);
    setSelectedDifficulty(null);
    setMaxTime(null);
    setSearchQuery("");
    filterByDifficulty(null);
    filterByTime(null);
  };

  const getSelectedSortLabel = () => {
    return sortOptions.find(option => option.value === selectedSort)?.label || "Sort";
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search Ethiopian recipes..."
        />
        <View style={styles.filterSortContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (selectedTag || selectedRegion || selectedDifficulty || maxTime ? styles.activeFilterButton : null),
            ]}
            onPress={toggleFilters}
          >
            <Filter
              size={20}
              color={
                selectedTag || selectedRegion || selectedDifficulty || maxTime
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
              {selectedTag && (
                <TouchableOpacity onPress={() => setSelectedTag(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {popularTags.map((tag) => (
                <CategoryPill
                  key={tag}
                  title={tag}
                  selected={selectedTag === tag}
                  onPress={() => handleTagSelect(tag)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Regions</Text>
              {selectedRegion && (
                <TouchableOpacity onPress={() => setSelectedRegion(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {regions.map((region) => (
                <CategoryPill
                  key={region}
                  title={region}
                  selected={selectedRegion === region}
                  onPress={() => handleRegionSelect(region)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Difficulty</Text>
              {selectedDifficulty && (
                <TouchableOpacity onPress={() => handleDifficultySelect(selectedDifficulty)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.difficultyContainer}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === difficulty && styles.selectedDifficultyButton,
                  ]}
                  onPress={() => handleDifficultySelect(difficulty)}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      selectedDifficulty === difficulty && styles.selectedDifficultyButtonText,
                    ]}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Cooking Time</Text>
              {maxTime && (
                <TouchableOpacity onPress={() => handleTimeSelect(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.timeContainer}>
              {[30, 60, 90, 120].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    maxTime === time && styles.selectedTimeButton,
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      maxTime === time && styles.selectedTimeButtonText,
                    ]}
                  >
                    {time === 120 ? "2+ hours" : `${time} min`}
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

      {filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? "two-column" : "one-column"}
          columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : undefined}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters to find what you're looking for
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
    padding: 20,
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
    backgroundColor: "#F9F5F0",
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
  sortOptionsContainer: {
    backgroundColor: "#F9F5F0",
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
    backgroundColor: "#F9F5F0" + "10",
  },
  sortOptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2D2D2D",
  },
  selectedSortOptionText: {
    color: "#3E7EA6",
    fontWeight: "600",
  },
  filtersContainer: {
    backgroundColor: "#F9F5F0",
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  selectedDifficultyButton: {
    backgroundColor: "#F9F5F0",
  },
  difficultyButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2D2D2D",
  },
  selectedDifficultyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  selectedTimeButton: {
    backgroundColor: "#F9F5F0",
  },
  timeButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2D2D2D",
  },
  selectedTimeButtonText: {
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
  recipesList: {
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
    color: "#8A8A8A",
    textAlign: "center",
  },
});
