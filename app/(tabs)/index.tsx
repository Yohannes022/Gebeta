import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Image,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MapPin, Star } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { categories } from "@/mocks/categories";
import { experiences } from "@/mocks/experience";
import { useExperiencesStore } from "@/store/experiences-store";
import ExperienceCard from "@/components/ExperianceCard";
import CategoryItem from "@/components/CategoryItem";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { featuredExperiences, popularExperiences, newExperiences } = useExperiencesStore();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleExperiencePress = (id: string) => {
    router.push(`/experience/${id}`);
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/search",
      params: { category: categoryId }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Discover</Text>
          <Text style={styles.title}>Ethiopian Culinary Experiences</Text>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.8}
        >
          <Search size={20} color={Colors.lightText} />
          <Text style={styles.searchText}>Search experiences...</Text>
        </TouchableOpacity>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryItem 
                category={item} 
                onPress={() => handleCategoryPress(item.id)} 
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
          <FlatList
            data={featuredExperiences}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExperienceCard 
                experience={item} 
                onPress={() => handleExperiencePress(item.id)}
                style={styles.horizontalCard}
              />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Experiences</Text>
          {popularExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onPress={() => handleExperiencePress(experience.id)}
              style={styles.verticalCard}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Experiences</Text>
          <FlatList
            data={newExperiences}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExperienceCard 
                experience={item} 
                onPress={() => handleExperiencePress(item.id)}
                style={styles.horizontalCard}
              />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
  },
  greeting: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Layout.spacing.l,
    marginVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    marginLeft: Layout.spacing.s,
    color: Colors.lightText,
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.l,
  },
  categoriesList: {
    paddingVertical: Layout.spacing.m,
  },
  section: {
    marginTop: Layout.spacing.l,
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: Layout.spacing.m,
    color: Colors.text,
  },
  horizontalList: {
    paddingRight: Layout.spacing.l,
  },
  horizontalCard: {
    width: 280,
    marginRight: Layout.spacing.m,
  },
  verticalCard: {
    marginBottom: Layout.spacing.m,
  },
});