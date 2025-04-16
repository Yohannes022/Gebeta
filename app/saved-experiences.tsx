import React from "react";
import { StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, ChevronLeft } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";
import { useExperiencesStore } from "@/store/experiences-store";
import ExperienceCard from "@/components/ExperianceCard";

export default function SavedExperiencesScreen() {
  const router = useRouter();
  const { user, unsaveExperience } = useAuthStore();
  const { experiences } = useExperiencesStore();

  const savedExperiences = experiences.filter(
    (exp) => user?.savedExperiences.includes(exp.id)
  );

  const handleExperiencePress = (id: string) => {
    router.push('/experience/${id}');
  };

  const handleUnsave = (id: string) => {
    unsaveExperience(id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Saved Experiences",
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Saved Experiences</Text>
          <Text style={styles.subtitle}>
            {savedExperiences.length} {savedExperiences.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {savedExperiences.length > 0 ? (
          <FlatList
            data={savedExperiences}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExperienceCard
                experience={item}
                onPress={() => handleExperiencePress(item.id)}
                onSavePress={() => handleUnsave(item.id)}
                isSaved={true}
                style={styles.card}
              />
            )}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Heart size={60} color={Colors.inactive} />
            <Text style={styles.emptyTitle}>No saved experiences</Text>
            <Text style={styles.emptyText}>
              Save experiences you like by tapping the heart icon
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.browseButtonText}>Browse Experiences</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    marginLeft: Layout.spacing.s,
  },
  header: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
  },
  list: {
    padding: Layout.spacing.l,
  },
  card: {
    marginBottom: Layout.spacing.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.s,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: "center",
    marginBottom: Layout.spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
  },
});