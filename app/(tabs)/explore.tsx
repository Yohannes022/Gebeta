import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MapPin, Star, Filter } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { categories } from "@/mocks/categories";
import { useExperiencesStore } from "@/store/experiences-store";
import ExperienceCard from "@/components/ExperianceCard";
import FilterModal from "@/components/FilterModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const { 
    experiences, 
    setSelectedCategory: storeSetSelectedCategory,
    setFilters
  } = useExperiencesStore();

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
    router.push("/experience/${id}");
  };

  const handleFilterApply = (filters: any) => {
    setIsFilterVisible(false);
    setFilters(filters);
  };

  const filteredExperiences = selectedCategory 
    ? experiences.filter(exp => exp.category === categories.find(c => c.id === selectedCategory)?.name)
    : experiences;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Filter size={20} color={Colors.text} />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategoryCard
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Image 
                  source={{ uri: category.image }} 
                  style={styles.categoryImage}
                />
                <Text 
                  style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.selectedCategoryName
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Locations</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            <TouchableOpacity style={styles.locationCard}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }} 
                style={styles.locationImage}
              />
              <View style={styles.locationOverlay}>
                <Text style={styles.locationName}>Addis Ababa</Text>
                <Text style={styles.locationCount}>24 experiences</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.locationCard}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }} 
                style={styles.locationImage}
              />
              <View style={styles.locationOverlay}>
                <Text style={styles.locationName}>Lalibela</Text>
                <Text style={styles.locationCount}>12 experiences</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.locationCard}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }} 
                style={styles.locationImage}
              />
              <View style={styles.locationOverlay}>
                <Text style={styles.locationName}>Gondar</Text>
                <Text style={styles.locationCount}>8 experiences</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Experiences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name} Experiences`
              : "All Experiences"}
          </Text>
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onPress={() => handleExperiencePress(experience.id)}
              style={styles.experienceCard}
            />
          ))}
        </View>
      </ScrollView>

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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Layout.spacing.s,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterText: {
    marginLeft: Layout.spacing.xs,
    fontSize: 14,
    color: Colors.text,
  },
  categoriesSection: {
    paddingVertical: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.l,
  },
  categoriesContainer: {
    paddingHorizontal: Layout.spacing.l,
  },
  categoryCard: {
    width: 120,
    marginRight: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
    backgroundColor: Colors.card,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategoryCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  categoryImage: {
    width: "100%",
    height: 80,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    textAlign: "center",
    padding: Layout.spacing.s,
  },
  selectedCategoryName: {
    color: Colors.primary,
  },
  section: {
    paddingVertical: Layout.spacing.l,
  },
  horizontalList: {
    paddingHorizontal: Layout.spacing.l,
  },
  locationCard: {
    width: CARD_WIDTH,
    height: 150,
    marginRight: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
    position: "relative",
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },
  locationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.m,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.background,
    marginBottom: 4,
  },
  locationCount: {
    fontSize: 14,
    color: Colors.background,
  },
  experienceCard: {
    marginHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
});